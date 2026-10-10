# Anas Yusuf Farhan | Portfolio

A modern portfolio website built with **Flask**, **Jinja2 templating**, **Tailwind CSS**, and **vanilla JavaScript**. Features a clean, responsive design with proper backend structure.

## 📁 Project Structure

```
portfolio/
├── app.py                    # Flask application (main entry point)
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── templates/               # Jinja2 templates (rendered by Flask)
│   ├── base.html           # Base template with layout
│   ├── index.html          # Home & skills page
│   ├── projects.html       # Portfolio projects page
│   ├── contact.html        # Contact page
│   ├── 404.html            # Not found page
│   ├── 500.html            # Server error page
│   └── components/         # Reusable template components
│       ├── navigation.html # Navigation bar
│       └── footer.html     # Footer
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom styles
│   ├── scss/
│   │   └── styles.scss     # SCSS source
│   └── js/
│       └── main.js         # JavaScript (module pattern)
└── projects/               # Example code projects
    ├── java/
    │   └── HelloWorld.java
    └── python/
        └── app.py
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ installed
- pip (Python package manager)

### Installation

1. **Clone or download** this repository
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

```bash
python app.py
```

Then visit `http://localhost:5000` in your browser.

**For development (with auto-reload):**
```bash
export FLASK_ENV=development  # macOS/Linux
set FLASK_ENV=development     # Windows
python app.py
```

## 📖 Pages

- **Home** (`/`) — Hero section with introduction and technical skills
- **Projects** (`/projects`) — Showcase of featured work
- **Interactive systems demos** — Local-first collaboration (`/demos/collaborative-editor`), event-flow monitoring (`/demos/event-pipeline`), and gateway policy analytics (`/demos/api-gateway`)
- **Contact** (`/contact`) — Dark-themed contact page with email and social links

## Interactive Systems Demos

The three systems demos are browser-based portfolio prototypes, not deployed distributed services:

- **Collaborative editor:** a small RGA-style CRDT persists its operation log in `localStorage` and syncs across open tabs with `BroadcastChannel`. It does not sync between devices or use a hosted WebSocket server.
- **Event-driven pipeline:** generated sample events animate through producer, broker, and consumer stages. No RabbitMQ/Kafka broker or microservice processes are running.
- **API gateway:** the playground simulates route matching, rolling-window quotas, and JWT fixture outcomes in one browser tab. It does not perform cryptographic JWT verification or use Redis.

Open each demo from the **Projects** page. These experiences demonstrate the concepts interactively while keeping the portfolio self-contained.

## 🛠️ Technology Stack

- **Backend:** Flask 3.0.0
- **Templating:** Jinja2
- **Frontend:** Tailwind CSS, vanilla JavaScript
- **Icons:** Font Awesome 6.0.0

## 🎨 Features

✅ **DRY Code** — Reusable base template eliminates duplication
✅ **Proper Routing** — Flask handles all URL routing
✅ **Error Handling** — 404 and 500 error pages
✅ **Responsive Design** — Mobile-first with Tailwind CSS
✅ **Module Pattern JS** — Clean, maintainable JavaScript
✅ **Python Packaging** — Proper dependencies and virtual env setup

## ✏️ Customization

### Update Personal Info

- **App title & links:** Update in `templates/components/navigation.html`
- **Hero content:** Edit in `templates/index.html`
- **Projects:** Modify in `templates/projects.html`
- **Contact details:** Update in `templates/contact.html`
  - Change email addresses (lines 24, 31)
  - Update GitHub URL (line 41)
  - Add LinkedIn profile (line 43)

### Styling

- **Tailwind classes:** Edit HTML files directly (Tailwind is CDN-based)
- **Custom CSS:** Add to `assets/css/styles.css`
- **SCSS compilation:** Edit `assets/scss/styles.scss` and compile as needed

### JavaScript

The portfolio uses the **Module Pattern** in `assets/js/main.js` for clean, organized code:
- All functionality is encapsulated in a `Portfolio` module
- Easy to extend with new features
- Analytics and event handlers are centralized

## 📝 Project Examples

**Flask REST API example** is available in `projects/python/app.py`:
```bash
cd projects/python
pip install flask
python app.py
```

**Java example** in `projects/java/HelloWorld.java`:
```bash
cd projects/java
javac HelloWorld.java
java HelloWorld
```

## 🚀 Deployment

### Deploy to Heroku

1. Create a `Procfile`:
   ```
   web: gunicorn app:app
   ```
2. Add Gunicorn to `requirements.txt`:
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```
3. Deploy using Heroku CLI

### Deploy to PythonAnywhere

1. Upload files to PythonAnywhere
2. Create a new Flask web app
3. Point to your `app.py`

## 📄 License

© 2026 Anas Yusuf Farhan. All rights reserved.
