from flask import Flask, render_template, jsonify, request, abort
import os

app = Flask(__name__, template_folder='templates', static_folder='assets')
app.config['ENV'] = os.getenv('FLASK_ENV', 'production')
app.config['DEBUG'] = app.config['ENV'] == 'development'

portfolio_projects = [
    {
        'slug': 'automated-reporting-pipeline',
        'title': 'Automated Reporting Pipeline',
        'category': 'Python Automation',
        'summary': 'Saved a client 10+ hours weekly by automating end-to-end report generation and delivery.',
        'problem': 'Manual report collection across spreadsheets and email wasted time and introduced errors.',
        'solution': 'A Python pipeline that extracts sales metrics, summarizes results, and sends polished CSV reports automatically.',
        'features': [
            'Data extraction from CSV and database-ready sources',
            'Reusable summary engine for weekly operations',
            'Automated email delivery with attachment support',
            'Easy cron / scheduler integration for unattended runs',
        ],
        'tech': ['Python', 'CSV Automation', 'Email Delivery', 'Scheduling'],
        'repo_url': 'https://github.com/yourusername/automated-reporting-pipeline',
        'image_url': 'images/project-reporting.svg',
        'code': '''import csv
import smtplib
from collections import defaultdict
from email.message import EmailMessage
from pathlib import Path

SOURCE_FILE = Path('data/sales.csv')
REPORT_FILE = Path('output/weekly-summary.csv')

def load_sales(path):
    with path.open(newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

def build_summary(records):
    totals = defaultdict(lambda: {'sales': 0.0, 'orders': 0})
    for row in records:
        key = row['region']
        totals[key]['sales'] += float(row['amount'])
        totals[key]['orders'] += 1
    return [{'region': region, 'total_sales': values['sales'], 'orders': values['orders']} for region, values in totals.items()]

def write_report(path, summary):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=['region', 'total_sales', 'orders'])
        writer.writeheader()
        writer.writerows(summary)

def send_report(email_from, email_to, subject, body, attachment_path):
    message = EmailMessage()
    message['From'] = email_from
    message['To'] = email_to
    message['Subject'] = subject
    message.set_content(body)

    with attachment_path.open('rb') as f:
        message.add_attachment(f.read(), maintype='text', subtype='csv', filename=attachment_path.name)

    with smtplib.SMTP('localhost') as smtp:
        smtp.send_message(message)

def main():
    records = load_sales(SOURCE_FILE)
    summary = build_summary(records)
    write_report(REPORT_FILE, summary)
    send_report(
        email_from='reports@example.com',
        email_to='client@example.com',
        subject='Weekly performance summary',
        body='Attached is your weekly sales summary.',
        attachment_path=REPORT_FILE,
    )

if __name__ == '__main__':
    main()
''',
    },
    {
        'slug': 'inventory-management-api',
        'title': 'Inventory Management API',
        'category': 'Java Backend',
        'summary': 'Built a Spring Boot API that supports high-traffic inventory operations and safe stock reservations.',
        'problem': 'High-volume stock queries caused slow responses in a growing e-commerce workflow.',
        'solution': 'A REST backend with clear inventory contracts, resilient error handling, and fast lookup endpoints.',
        'features': [
            'Fast GET and search endpoints for stock availability',
            'POST reservation endpoint with optimistic stock checks',
            'Clean service layer separation for maintainability',
            'Designed for deployment behind load balancers',
        ],
        'tech': ['Java', 'Spring Boot', 'PostgreSQL', 'REST API'],
        'repo_url': 'https://github.com/yourusername/inventory-management-api',
        'image_url': 'images/project-inventory.svg',
        'code': '''@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{sku}")
    public ResponseEntity<InventoryDto> getInventory(@PathVariable String sku) {
        return ResponseEntity.ok(inventoryService.findBySku(sku));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Void> reserveStock(@RequestBody ReserveRequest request) {
        inventoryService.reserve(request.getSku(), request.getQuantity());
        return ResponseEntity.noContent().build();
    }
}
''',
    },
    {
        'slug': 'learning-quiz-engine',
        'title': 'Learning Quiz Engine',
        'category': 'Python Product',
        'summary': 'An interactive Python quiz engine designed to improve review speed and confidence.',
        'problem': 'Students needed a reusable way to turn knowledge checks into fast, repeatable practice sessions.',
        'solution': 'A modular quiz engine with dynamic questions, scoring, and replay support.',
        'features': [
            'Modular question and scoring system',
            'Immediate feedback after every answer',
            'Replay-friendly flow for rapid practice',
            'Easy expansion with new question sets',
        ],
        'tech': ['Python', 'CLI/Flask', 'Modular Architecture'],
        'repo_url': 'https://github.com/yourusername/learning-quiz-engine',
        'image_url': 'images/project-quiz.svg',
        'demo_url': '/apps/quiz',
        'code': '''from dataclasses import dataclass
from typing import List

@dataclass
class Question:
    prompt: str
    answer: str

class QuizEngine:
    def __init__(self, questions: List[Question]):
        self.questions = questions
        self.score = 0

    def ask(self, question: Question) -> None:
        user_answer = input(f"{question.prompt} ")
        if user_answer.strip().lower() == question.answer.lower():
            self.score += 1
            print('Correct!')
        else:
            print(f"Incorrect. The correct answer is {question.answer}.")

    def run(self):
        for question in self.questions:
            self.ask(question)
        print(f"Score: {self.score}/{len(self.questions)}")

if __name__ == '__main__':
    sample_questions = [
        Question(prompt='What is the keyword to define a function in Python?', answer='def'),
        Question(prompt='Which HTTP method is used to update an existing resource?', answer='PUT'),
        Question(prompt='What package is commonly used for data analysis in Python?', answer='pandas'),
    ]
    QuizEngine(sample_questions).run()
''',
    },
    {
        'slug': 'shape-calculator',
        'title': 'Shape Calculator',
        'category': 'Python Utility',
        'summary': 'A geometry calculator script for area, perimeter, and volume calculations.',
        'problem': 'Students and small teams needed fast shape calculations without reaching for a textbook.',
        'solution': 'A clean Python utility that computes formulas for circles, ellipses, triangles, cones, spheres, and cylinders.',
        'features': [
            'Area and perimeter for common shapes',
            'Volume calculations for 3D objects',
            'Input validation and helpful prompts',
            'Easy to reuse in console workflows',
        ],
        'tech': ['Python', 'CLI', 'Math Utilities'],
        'repo_url': 'https://github.com/yourusername/shape-calculator',
        'image_url': 'images/project-shape.svg',
        'demo_url': '/apps/shape-calculator',
        'code': '''import math

def area_circle(radius):
    return math.pi * radius**2

def perimeter_circle(radius):
    return 2 * math.pi * radius

def area_ellipse(major_axis, minor_axis):
    return math.pi * major_axis * minor_axis

def perimeter_ellipse(major_axis, minor_axis):
    return math.pi * (3 * (major_axis + minor_axis) - math.sqrt(
        (3 * major_axis + minor_axis) * (major_axis + 3 * minor_axis)))

def area_equilateral_triangle(side):
    return (math.sqrt(3) / 4) * side**2

def perimeter_equilateral_triangle(side):
    return 3 * side

def volume_cone(radius, height):
    return (1 / 3) * math.pi * radius**2 * height

def volume_sphere(radius):
    return (4 / 3) * math.pi * radius**3

def volume_cylinder(radius, height):
    return math.pi * radius**2 * height

if __name__ == '__main__':
    print('This script is intended to be used as a command-line calculator.')
''',
    },
 ]

arcade_items = [
    {
        'title': 'Python Quiz Engine',
        'description': 'Launch the interactive quiz engine and practice questions in the browser.',
        'image_url': 'images/project-quiz.svg',
        'demo_url': '/apps/quiz',
        'source_url': 'https://github.com/yourusername/learning-quiz-engine',
        'tags': ['Python', 'Live Demo'],
    },
    {
        'title': 'Shape Calculator',
        'description': 'Use the geometry calculator with live shape selection, area, and volume calculations.',
        'image_url': 'images/project-shape.svg',
        'demo_url': '/apps/shape-calculator',
        'source_url': 'https://github.com/yourusername/shape-calculator',
        'tags': ['Python', 'Utility'],
    },
    {
        'title': 'Automated Reporting Pipeline',
        'description': 'Explore the reporting automation project and view the source code used to generate weekly reports.',
        'image_url': 'images/project-reporting.svg',
        'demo_url': '/projects/automated-reporting-pipeline',
        'source_url': 'https://github.com/yourusername/automated-reporting-pipeline',
        'tags': ['Python', 'Automation'],
    },
    {
        'title': 'Inventory Management API',
        'description': 'Review the enterprise inventory backend architecture and source code for the Spring Boot API.',
        'image_url': 'images/project-inventory.svg',
        'demo_url': '/projects/inventory-management-api',
        'source_url': 'https://github.com/yourusername/inventory-management-api',
        'tags': ['Java', 'Backend'],
    },
]

def find_project(slug):
    return next((project for project in portfolio_projects if project['slug'] == slug), None)

@app.route('/')
def home():
    return render_template('index.html', featured_projects=portfolio_projects[:3])

@app.route('/projects')
def projects():
    return render_template('projects.html', projects=portfolio_projects)

@app.route('/projects/<slug>')
def project_detail(slug):
    project = find_project(slug)
    if project is None:
        abort(404)
    return render_template('project_detail.html', project=project)

@app.route('/apps')
def apps():
    return render_template('apps.html')

@app.route('/arcade')
def arcade():
    return render_template('arcade.html', arcade_items=arcade_items)

@app.route('/apps/quiz')
def apps_quiz():
    return render_template('app_quiz.html')

@app.route('/apps/shape-calculator')
def apps_shape_calculator():
    return render_template('app_shape_calculator.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/api/echo', methods=['POST'])
def echo():
    """Echo API endpoint for testing"""
    data = request.get_json() or {}
    return jsonify({'you_sent': data})

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])
