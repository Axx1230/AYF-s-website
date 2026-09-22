document.addEventListener('DOMContentLoaded', () => {
  const quizContainer = document.getElementById('quiz-status');
  const quizForm = document.getElementById('quiz-form');
  const quizComplete = document.getElementById('quiz-complete');
  const startButton = document.getElementById('start-quiz-btn');
  const submitButton = document.getElementById('submit-answer-btn');
  const nextButton = document.getElementById('next-question-btn');
  const retryButton = document.getElementById('retry-quiz-btn');
  const questionText = document.getElementById('quiz-question');
  const subtitleText = document.getElementById('quiz-subtitle');
  const answerInput = document.getElementById('quiz-answer');
  const feedbackText = document.getElementById('feedback');
  const resultText = document.getElementById('quiz-result');

  const quizQuestions = [
    { prompt: 'What keyword starts a function definition in Python?', answer: 'def' },
    { prompt: 'What is the Python package commonly used for data analysis?', answer: 'pandas' },
    { prompt: 'Which HTTP method should be used to create a new resource?', answer: 'POST' },
    { prompt: 'What is the symbol used for comments in Python?', answer: '#' },
    { prompt: 'In Java, which keyword creates a new object instance?', answer: 'new' },
    { prompt: 'Which HTTP status code means OK?', answer: '200' },
    { prompt: 'What data format uses curly braces and key/value pairs?', answer: 'json' },
    { prompt: 'What priority should you use to stop a service in Linux?', answer: 'kill' },
    { prompt: 'Which Python library is often used for machine learning?', answer: 'scikit-learn' },
    { prompt: 'What does API stand for?', answer: 'application programming interface' }
  ];

  let currentQuestion = 0;
  let score = 0;

  const normalize = (value) => value.trim().toLowerCase();

  const renderQuizQuestion = () => {
    const question = quizQuestions[currentQuestion];
    questionText.textContent = `${currentQuestion + 1}. ${question.prompt}`;
    subtitleText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    feedbackText.textContent = '';
    answerInput.value = '';
    answerInput.focus();
  };

  const showQuizScreen = () => {
    quizContainer.classList.remove('hidden');
    quizForm.classList.remove('hidden');
    quizComplete.classList.add('hidden');
    nextButton.classList.add('hidden');
    submitButton.classList.remove('hidden');
  };

  const showQuizComplete = () => {
    quizForm.classList.add('hidden');
    quizComplete.classList.remove('hidden');
    resultText.textContent = `You scored ${score} out of ${quizQuestions.length}. Great job!`;
  };

  const handleAnswerSubmission = () => {
    const answer = normalize(answerInput.value);
    const correct = normalize(quizQuestions[currentQuestion].answer);
    if (!answer) {
      feedbackText.textContent = 'Please type an answer before submitting.';
      return;
    }

    if (answer === correct) {
      score += 1;
      feedbackText.textContent = 'Correct!';
      feedbackText.classList.remove('text-red-600');
      feedbackText.classList.add('text-green-600');
    } else {
      feedbackText.textContent = `Incorrect. The correct answer is ${quizQuestions[currentQuestion].answer}.`;
      feedbackText.classList.remove('text-green-600');
      feedbackText.classList.add('text-red-600');
    }

    submitButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
  };

  const handleNextQuestion = () => {
    currentQuestion += 1;
    if (currentQuestion >= quizQuestions.length) {
      showQuizComplete();
      return;
    }
    renderQuizQuestion();
    submitButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
  };

  const startQuiz = () => {
    currentQuestion = 0;
    score = 0;
    showQuizScreen();
    renderQuizQuestion();
  };

  if (startButton && quizContainer && quizForm) {
    startButton.addEventListener('click', startQuiz);
    submitButton.addEventListener('click', handleAnswerSubmission);
    nextButton.addEventListener('click', handleNextQuestion);
    retryButton.addEventListener('click', startQuiz);
  }

  const calculatorRoot = document.getElementById('shape-calculator-app');
  const shapeSelect = document.getElementById('shape-select');
  const inputsContainer = document.getElementById('calculator-inputs');
  const resultsContainer = document.getElementById('calculator-results');
  const calculateButton = document.getElementById('calculate-shape-btn');
  const resetButton = document.getElementById('reset-shape-btn');

  const shapeTemplates = {
    circle: [
      { name: 'radius', label: 'Radius', type: 'number', min: '0.1', step: '0.1' }
    ],
    ellipse: [
      { name: 'major_axis', label: 'Major axis', type: 'number', min: '0.1', step: '0.1' },
      { name: 'minor_axis', label: 'Minor axis', type: 'number', min: '0.1', step: '0.1' }
    ],
    'equilateral-triangle': [
      { name: 'side', label: 'Side length', type: 'number', min: '0.1', step: '0.1' }
    ],
    cone: [
      { name: 'radius', label: 'Radius', type: 'number', min: '0.1', step: '0.1' },
      { name: 'height', label: 'Height', type: 'number', min: '0.1', step: '0.1' }
    ],
    sphere: [
      { name: 'radius', label: 'Radius', type: 'number', min: '0.1', step: '0.1' }
    ],
    cylinder: [
      { name: 'radius', label: 'Radius', type: 'number', min: '0.1', step: '0.1' },
      { name: 'height', label: 'Height', type: 'number', min: '0.1', step: '0.1' }
    ]
  };

  const formatNumber = (value) => Number(value).toFixed(2);

  const renderShapeInputs = () => {
    const shape = shapeSelect.value;
    const inputs = shapeTemplates[shape] || [];
    inputsContainer.innerHTML = inputs.map((field) => `
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2" for="${field.name}">${field.label}</label>
        <input id="${field.name}" name="${field.name}" type="${field.type}" min="${field.min}" step="${field.step}" class="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none" required>
      </div>
    `).join('');
    resultsContainer.innerHTML = '<p class="text-sm">Enter values and click Calculate to see your result.</p>';
  };

  const calculateShape = () => {
    const shape = shapeSelect.value;
    const values = {};
    const formData = new FormData(calculatorRoot);
    for (const [key, value] of formData.entries()) {
      values[key] = Number(value);
    }

    const invalid = Object.values(values).some((value) => Number.isNaN(value) || value <= 0);
    if (invalid) {
      resultsContainer.innerHTML = '<p class="text-red-600">Please provide valid positive numbers for every field.</p>';
      return;
    }

    const results = [];
    if (shape === 'circle') {
      results.push(`Area: ${formatNumber(Math.PI * values.radius ** 2)}`);
      results.push(`Perimeter: ${formatNumber(2 * Math.PI * values.radius)}`);
    } else if (shape === 'ellipse') {
      results.push(`Area: ${formatNumber(Math.PI * values.major_axis * values.minor_axis)}`);
      results.push(`Approximate perimeter: ${formatNumber(Math.PI * (3 * (values.major_axis + values.minor_axis) - Math.sqrt((3 * values.major_axis + values.minor_axis) * (values.major_axis + 3 * values.minor_axis))))}`);
    } else if (shape === 'equilateral-triangle') {
      results.push(`Area: ${formatNumber((Math.sqrt(3) / 4) * values.side ** 2)}`);
      results.push(`Perimeter: ${formatNumber(3 * values.side)}`);
    } else if (shape === 'cone') {
      results.push(`Volume: ${formatNumber((1 / 3) * Math.PI * values.radius ** 2 * values.height)}`);
    } else if (shape === 'sphere') {
      results.push(`Volume: ${formatNumber((4 / 3) * Math.PI * values.radius ** 3)}`);
    } else if (shape === 'cylinder') {
      results.push(`Volume: ${formatNumber(Math.PI * values.radius ** 2 * values.height)}`);
    }

    resultsContainer.innerHTML = results.map((text) => `<p class="text-slate-700">${text}</p>`).join('');
  };

  const resetCalculator = () => {
    shapeSelect.value = 'circle';
    renderShapeInputs();
  };

  if (calculatorRoot && shapeSelect) {
    renderShapeInputs();
    shapeSelect.addEventListener('change', renderShapeInputs);
    calculateButton.addEventListener('click', calculateShape);
    resetButton.addEventListener('click', resetCalculator);
  }
});
