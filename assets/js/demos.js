(() => {
  const editor = document.getElementById('collab-editor');
  if (editor) initializeEditor(editor);

  const pipeline = document.querySelector('[data-demo="pipeline"]');
  if (pipeline) initializePipeline(pipeline);

  const gateway = document.querySelector('[data-demo="gateway"]');
  if (gateway) initializeGateway(gateway);

  function initializeEditor(textarea) {
    const storageKey = 'portfolio-crdt-editor-v2';
    const actor = globalThis.crypto?.randomUUID?.() ?? `actor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const operations = [];
    const operationIds = new Set();
    const atoms = new Map();
    const tombstones = new Set();
    let counter = 0;
    let channel;
    let statusMessage = 'Saved on this device';

    const syncLabel = document.getElementById('editor-sync');
    const connection = document.getElementById('editor-connection');
    const operationCount = document.getElementById('editor-op-count');
    const wordCount = document.getElementById('editor-word-count');
    const actorLabel = document.getElementById('editor-actor');

    actorLabel.textContent = `This tab · ${actor.slice(0, 8)}`;

    const nextId = () => `${String(++counter).padStart(12, '0')}@${actor}`;

    const visibleAtoms = () => {
      const children = new Map();
      for (const atom of atoms.values()) {
        const siblings = children.get(atom.after) ?? [];
        siblings.push(atom);
        children.set(atom.after, siblings);
      }
      for (const siblings of children.values()) {
        siblings.sort((left, right) => {
          const leftClock = Number(left.id.slice(0, left.id.indexOf('@'))) || 0;
          const rightClock = Number(right.id.slice(0, right.id.indexOf('@'))) || 0;
          if (leftClock !== rightClock) return rightClock - leftClock;
          return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
        });
      }
      const visible = [];
      const visited = new Set();
      const visit = parent => {
        for (const child of children.get(parent) ?? []) {
          if (visited.has(child.id)) continue;
          visited.add(child.id);
          if (!tombstones.has(child.id)) visible.push(child);
          visit(child.id);
        }
      };
      visit('HEAD');
      return visible;
    };

    const currentText = () => visibleAtoms().map(atom => atom.value).join('');

    const persist = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(operations));
        statusMessage = 'Saved on this device';
      } catch (error) {
        statusMessage = `Local save failed: ${error.message}`;
      }
    };

    const render = caret => {
      const text = currentText();
      if (textarea.value !== text) textarea.value = text;
      if (Number.isInteger(caret)) {
        const position = Math.min(caret, text.length);
        textarea.setSelectionRange(position, position);
      }
      wordCount.textContent = String(text.trim() ? text.trim().split(/\s+/).length : 0);
      operationCount.textContent = String(operations.length);
      syncLabel.textContent = statusMessage;
    };

    const apply = (operation, announce = true) => {
      if (!operation || typeof operation.id !== 'string' || operationIds.has(operation.id)) return false;
      if (operation.type === 'insert' && typeof operation.value === 'string' &&
          operation.value.length === 1 && typeof operation.after === 'string') {
        atoms.set(operation.id, { id: operation.id, after: operation.after, value: operation.value });
      } else if (operation.type === 'delete' && typeof operation.target === 'string') {
        tombstones.add(operation.target);
      } else {
        return false;
      }
      operationIds.add(operation.id);
      operations.push(operation);
      const separator = operation.id.indexOf('@');
      if (separator > 0) {
        counter = Math.max(counter, Number(operation.id.slice(0, separator)) || 0);
      }
      if (announce) {
        persist();
        channel?.postMessage({ operation });
      }
      return true;
    };

    const loadStoredOperations = () => {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error('Saved document has an unexpected format.');
      for (const operation of parsed) {
        apply(operation, false);
      }
    };

    try {
      loadStoredOperations();
    } catch (error) {
      statusMessage = `Could not load saved document: ${error.message}`;
    }

    try {
      channel = new BroadcastChannel(storageKey);
      channel.addEventListener('message', event => {
        if (event.data?.reset) {
          window.location.reload();
          return;
        }
        if (!apply(event.data?.operation, false)) return;
        persist();
        render(textarea.selectionStart);
        statusMessage = 'Synced with another open tab';
        syncLabel.textContent = statusMessage;
      });
    } catch (error) {
      statusMessage = `Cross-tab sync unavailable: ${error.message}`;
    }

    window.addEventListener('storage', event => {
      if (event.key !== storageKey) return;
      if (!event.newValue) {
        window.location.reload();
        return;
      }
      try {
        const incoming = JSON.parse(event.newValue);
        if (!Array.isArray(incoming)) throw new Error('Saved document has an unexpected format.');
        let changed = false;
        for (const operation of incoming) changed = apply(operation, false) || changed;
        if (changed) {
          persist();
          render(textarea.selectionStart);
          statusMessage = 'Recovered edits from another tab';
          syncLabel.textContent = statusMessage;
        }
      } catch (error) {
        statusMessage = `Could not sync saved edits: ${error.message}`;
        syncLabel.textContent = statusMessage;
      }
    });

    textarea.addEventListener('input', () => {
      const before = currentText();
      const after = textarea.value;
      let prefix = 0;
      while (prefix < before.length && prefix < after.length && before[prefix] === after[prefix]) prefix += 1;
      let suffix = 0;
      while (suffix < before.length - prefix && suffix < after.length - prefix &&
             before[before.length - 1 - suffix] === after[after.length - 1 - suffix]) suffix += 1;

      const oldAtoms = visibleAtoms();
      for (let index = prefix; index < before.length - suffix; index += 1) {
        apply({ type: 'delete', id: nextId(), target: oldAtoms[index].id });
      }

      let parent = prefix ? oldAtoms[prefix - 1].id : 'HEAD';
      for (const value of after.slice(prefix, after.length - suffix)) {
        const id = nextId();
        apply({ type: 'insert', id, after: parent, value });
        parent = id;
      }
      render(textarea.selectionStart);
    });

    const updateConnection = () => {
      const online = navigator.onLine;
      connection.classList.toggle('is-offline', !online);
      connection.replaceChildren();
      const dot = document.createElement('span');
      dot.className = 'status-dot';
      connection.append(dot, document.createTextNode(online ? 'Local sync ready' : 'Offline · editing locally'));
    };
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    document.getElementById('editor-reset').addEventListener('click', () => {
      if (!window.confirm('Start a blank document on this device? This clears the saved document for every tab using this browser.')) return;
      try {
        channel?.postMessage({ reset: true });
        localStorage.removeItem(storageKey);
        window.location.reload();
      } catch (error) {
        statusMessage = `Could not start a blank document: ${error.message}`;
        syncLabel.textContent = statusMessage;
      }
    });

    updateConnection();
    render();
  }

  function initializePipeline(root) {
    const processed = root.querySelector('#pipeline-processed');
    const queue = root.querySelector('#pipeline-queue');
    const latency = root.querySelector('#pipeline-latency');
    const normalizer = root.querySelector('#pipeline-normalizer');
    const risk = root.querySelector('#pipeline-risk');
    const brokerLabel = root.querySelector('#pipeline-broker');
    const eventRows = root.querySelector('#pipeline-events');
    const filter = root.querySelector('#pipeline-filter');
    const toggle = root.querySelector('#pipeline-toggle');
    const publish = root.querySelector('#pipeline-publish');
    const streamState = root.querySelector('#pipeline-stream-state');
    const events = [];
    let processedCount = 0;
    let queued = 0;
    let totalLatency = 0;
    let paused = false;
    let timer;
    const symbols = ['ACME', 'NOVA', 'ORBT', 'LUMA', 'VYNE'];
    const types = ['trade', 'trade', 'trade', 'quote', 'alert'];

    const renderEvents = () => {
      const visible = events.filter(event => filter.value === 'all' || event.type === filter.value).slice(0, 12);
      eventRows.replaceChildren();
      if (!visible.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'empty-state';
        cell.textContent = 'No events match this filter yet.';
        row.append(cell);
        eventRows.append(row);
        return;
      }
      for (const event of visible) {
        const row = document.createElement('tr');
        const values = [
          new Date(event.timestamp).toLocaleTimeString(),
          event.type.toUpperCase(),
          event.symbol,
          event.detail,
        ];
        for (const [index, value] of values.entries()) {
          const cell = document.createElement('td');
          cell.textContent = value;
          if (index === 1) {
            const badge = document.createElement('span');
            badge.className = `event-type${event.type === 'alert' ? ' alert' : ''}`;
            badge.textContent = value;
            cell.replaceChildren(badge);
          }
          row.append(cell);
        }
        const result = document.createElement('td');
        result.textContent = event.result;
        row.append(result);
        eventRows.append(row);
      }
    };

    const refreshMetrics = () => {
      processed.textContent = String(processedCount);
      queue.textContent = String(queued);
      brokerLabel.textContent = `${queued} queued`;
      normalizer.textContent = `${processedCount} processed`;
      risk.textContent = `${processedCount} processed`;
    };

    const emit = () => {
      const type = types[Math.floor(Math.random() * types.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const price = (25 + Math.random() * 280).toFixed(2);
      const event = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type,
        symbol,
        detail: type === 'trade' ? `${1 + Math.floor(Math.random() * 40)} shares · $${price}` :
          type === 'alert' ? `Volatility threshold · $${price}` : `Quote update · $${price}`,
        result: type === 'alert' && Math.random() > 0.6 ? 'Flagged for review' : 'Accepted',
      };
      events.unshift(event);
      queued += 1;
      refreshMetrics();
      renderEvents();
      const duration = 160 + Math.floor(Math.random() * 440);
      window.setTimeout(() => {
        queued = Math.max(0, queued - 1);
        processedCount += 1;
        totalLatency += duration;
        latency.textContent = `${Math.round(totalLatency / processedCount)} ms`;
        refreshMetrics();
      }, duration);
    };

    const start = () => {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(emit, 1800);
    };
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.textContent = paused ? 'Resume stream' : 'Pause stream';
      streamState.classList.toggle('is-paused', paused);
      const dot = document.createElement('span');
      dot.className = 'status-dot';
      streamState.replaceChildren(dot, document.createTextNode(paused ? 'Stream paused' : 'Stream running'));
      if (paused) window.clearInterval(timer);
      else start();
    });
    publish.addEventListener('click', emit);
    filter.addEventListener('change', renderEvents);
    start();
  }

  function initializeGateway(root) {
    const routes = new Map([
      ['/api/v1/quotes', 'quotes-service'],
      ['/api/v1/orders', 'orders-service'],
      ['/api/v1/portfolio', 'portfolio-service'],
    ]);
    const windows = new Map();
    const history = [];
    const counts = { total: 0, forwarded: 0, limited: 0, unauthorized: 0 };
    const pathInput = root.querySelector('#gateway-path');
    const clientInput = root.querySelector('#gateway-client');
    const tokenInput = root.querySelector('#gateway-token');
    const limitInput = root.querySelector('#gateway-limit');
    const result = root.querySelector('#gateway-result');
    const historyBody = root.querySelector('#gateway-history');

    const renderHistory = () => {
      historyBody.replaceChildren();
      if (!history.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'empty-state';
        cell.textContent = 'No requests yet. Send one to inspect the decision path.';
        row.append(cell);
        historyBody.append(row);
        return;
      }
      for (const request of history) {
        const row = document.createElement('tr');
        const values = [request.time, request.client, request.path, request.upstream];
        for (const value of values) {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        }
        const status = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `response-code ${request.status < 400 ? 'accepted' : 'denied'}`;
        badge.textContent = `${request.status} ${request.label}`;
        status.append(badge);
        row.append(status);
        historyBody.append(row);
      }
    };

    const updateCounts = () => {
      root.querySelector('#gateway-total').textContent = String(counts.total);
      root.querySelector('#gateway-forwarded').textContent = String(counts.forwarded);
      root.querySelector('#gateway-limited').textContent = String(counts.limited);
      root.querySelector('#gateway-unauthorized').textContent = String(counts.unauthorized);
    };

    const sendRequest = () => {
      const now = Date.now();
      const path = pathInput.value;
      const client = clientInput.value.trim();
      const upstream = routes.get(path) ?? '—';
      const timestamps = windows.get(client) ?? [];
      const recent = timestamps.filter(timestamp => now - timestamp < 10000);
      const limit = Number(limitInput.value);
      let status = 200;
      let label = 'Forwarded';
      let detail;

      counts.total += 1;
      if (!client) {
        status = 400;
        label = 'Missing client ID';
        detail = 'Enter a client ID before sending a request.';
      } else if (!routes.has(path)) {
        status = 404;
        label = 'Route not found';
        detail = 'No upstream is configured for this path.';
      } else if (tokenInput.value !== 'valid') {
        status = 401;
        label = tokenInput.value === 'expired' ? 'Token expired' : 'Invalid signature';
        detail = `JWT fixture rejected: ${label.toLowerCase()}.`;
        counts.unauthorized += 1;
      } else if (recent.length >= limit) {
        status = 429;
        label = 'Rate limited';
        detail = `Quota exceeded: ${recent.length} of ${limit} requests in the last 10 seconds.`;
        counts.limited += 1;
      } else {
        recent.push(now);
        windows.set(client, recent);
        counts.forwarded += 1;
        detail = `Forwarded to ${upstream}. ${recent.length} of ${limit} requests used in this window.`;
      }

      const entry = {
        time: new Date(now).toLocaleTimeString(),
        client: client || '(missing)',
        path,
        upstream: status === 200 ? upstream : '—',
        status,
        label,
      };
      history.unshift(entry);
      history.splice(15);
      result.textContent = `HTTP ${status} · ${detail}`;
      result.classList.toggle('is-success', status < 400);
      result.classList.toggle('is-error', status >= 400);
      updateCounts();
      renderHistory();
    };

    root.querySelector('#gateway-send').addEventListener('click', sendRequest);
    root.querySelector('#gateway-burst').addEventListener('click', () => {
      for (let request = 0; request < 5; request += 1) sendRequest();
    });
    root.querySelector('#gateway-clear').addEventListener('click', () => {
      history.length = 0;
      renderHistory();
    });
    updateCounts();
  }
})();
