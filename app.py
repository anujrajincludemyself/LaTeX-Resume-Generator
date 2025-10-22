# app.py
import os
import subprocess
import uuid
import json
from flask import Flask, request, send_file, after_this_request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from jinja2 import Environment, FileSystemLoader # Use Jinja2 env for flexibility
from models import db, Resume # Import from models.py

app = Flask(__name__)

# --- 1. CONFIGURATION ---

# !!! IMPORTANT: Make sure your password is correct here !!!
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost/resume_builder_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS to allow requests from your React app (http://localhost:3000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize Database
db.init_app(app)
migrate = Migrate(app, db)

# Setup temp directory
TEMP_DIR = os.path.join(app.root_path, 'temp')
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

# Setup Jinja2 environment to load the .tex template
latex_jinja_env = Environment(
    loader=FileSystemLoader(app.root_path),
    block_start_string='\\BLOCK{',
    block_end_string='}',
    variable_start_string='\\VAR{',
    variable_end_string='}',
    comment_start_string='\\#{',
    comment_end_string='}',
    line_statement_prefix='%%',
    line_comment_prefix='%#',
    trim_blocks=True,
    autoescape=False
)

# --- 2. HELPER FUNCTION: CREATE PDF (FINAL VERSION WITH SHELL ESCAPE) ---

def create_pdf(data):
    """Renders LaTeX template and compiles it to PDF."""
    
    # Load the .tex template
    template = latex_jinja_env.get_template('resume_template.tex')
    
    # Render the template with data
    rendered_tex = template.render(
        name=data.get('name', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        linkedin=data.get('linkedin', ''),
        github=data.get('github', ''),
        summary=data.get('summary', ''),
        education=data.get('education', []),
        skills=data.get('skills', {}),
        projects=data.get('projects', []),
        experience=data.get('experience', []),
        hackathons=data.get('hackathons', []),
        pors=data.get('pors', []),
        certifications=data.get('certifications', [])
    )
    
    unique_id = str(uuid.uuid4())
    base_filename = os.path.join(TEMP_DIR, f'resume_{unique_id}')
    tex_filename = f'{base_filename}.tex'
    pdf_filename = f'{base_filename}.pdf'
    log_filename = f'{base_filename}.log' # For debugging
    
    # List of files to cleanup
    temp_files = [
        tex_filename, pdf_filename, log_filename,
        f'{base_filename}.aux', f'{base_filename}.out'
    ]

    try:
        # Write rendered .tex file
        with open(tex_filename, 'w', encoding='utf-8') as f:
            f.write(rendered_tex)

        # Run pdflatex command WITH -shell-escape
        process = None
        for i in range(2): 
            process = subprocess.run(
                [r'C:\Program Files\MiKTeX\miktex\bin\x64\pdflatex.exe', '-shell-escape', '-interaction=nonstopmode', '-output-directory', TEMP_DIR, tex_filename], # <-- ADDED -shell-escape
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            # Stop if the first run failed
            if process.returncode != 0 and not os.path.exists(pdf_filename):
                break
        
        # --- ERROR CHECKING ---
        if not os.path.exists(pdf_filename):
            log_content = "No log file found, and stdout/stderr were empty." # Default
    
            if os.path.exists(log_filename):
                with open(log_filename, 'r', encoding='utf-8') as log_file:
                    log_content = log_file.read() 
            
            elif process and (process.stderr or process.stdout): 
                log_content = f"Log file was missing. Using stdout/stderr:\n\npdflatex failed with return code {process.returncode}\n\nSTDOUT:\n{process.stdout}\n\nSTDERR:\n{process.stderr}"

            raise Exception(f"PDF generation failed. LaTeX Error:\n\n{log_content}")

        return pdf_filename, temp_files

    except FileNotFoundError as e:
        raise Exception("PDF generation failed: 'pdflatex' command not found. Please ensure MiKTeX is installed and the path in app.py is correct.")
    except Exception as e:
        for f in temp_files:
            if os.path.exists(f): os.remove(f)
        raise e


# --- 3. API ENDPOINT ---

@app.route('/api/generate', methods=['POST'])
def generate_resume_api():
    """API endpoint to receive JSON, save to DB, and return PDF."""
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        # --- Save to Database (Optional) ---
        new_resume = Resume(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            linkedin=data.get('linkedin'),
            github=data.get('github'),
            summary=data.get('summary'),
            education=data.get('education'),
            skills=data.get('skills'),
            projects=data.get('projects'),
            experience=data.get('experience'),
            hackathons=data.get('hackathons'),
            pors=data.get('pors'),
            certifications=data.get('certifications')
        )
        db.session.add(new_resume)
        db.session.commit()
        # --- End of Database Logic ---

        # Generate the PDF
        pdf_filename, temp_files = create_pdf(data)

        # Use after_this_request to cleanup files after sending
        @after_this_request
        def cleanup(response):
            for f in temp_files:
                try:
                    if os.path.exists(f):
                        os.remove(f)
                except Exception as e:
                    app.logger.error(f"Error removing temp file {f}: {e}")
            return response
        
        # Send the generated PDF
        return send_file(
            pdf_filename,
            as_attachment=True,
            download_name=f"{data.get('name', 'resume').replace(' ', '_')}.pdf"
        )
    
    except Exception as e:
        print(f"Error: {e}") # Print error to Flask console
        return jsonify({"error": str(e)}), 500

# Use 'flask run' to start the server