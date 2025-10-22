# LaTeX-Resume-Generator
A web application that generates professional PDF resumes from user input using a React frontend, Flask backend, and LaTeX templating. Enter your details into the form, and download a compiled PDF


Backend (resume-backend)
Language/Framework: Python using the Flask web framework.

Database: MySQL is used to store the resume data submitted through the form. Flask-SQLAlchemy is used to interact with the database. The mysql-connector-python library is used as the database driver.

Templating: Jinja2 is used to insert the user's data into the resume_template.tex file.

PDF Generation: It calls the pdflatex command (which must be installed separately via MiKTeX or TeX Live) to compile the .tex file into a PDF. It uses the -shell-escape flag to allow the verbments LaTeX package to work correctly for handling special characters.

API: It provides one main API endpoint (/api/generate) that accepts JSON data via a POST request.

Output: Sends the generated PDF file back to the browser for download.

Dependencies: Requires Python, Flask libraries (Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, mysql-connector-python, Jinja2), a MySQL server, and a LaTeX distribution.

Frontend (resume-frontend)
Language/Framework: JavaScript using the React.js library.

User Interface: Provides a web form with sections corresponding to the resume structure (Personal Info, Education, Experience, Projects, Skills, etc.).

State Management: Uses React's useState hook to manage the form data, including dynamic lists for education, experience, projects, etc., allowing users to add or remove items.

API Interaction: When the user submits the form, it sends all the collected data as a single JSON object to the backend's /api/generate endpoint using a fetch POST request.

Output Handling: Receives the PDF file from the backend as a Blob, creates a temporary URL for it, and programmatically clicks a link to trigger the browser's download functionality.

Dependencies: Requires Node.js and npm to install packages and run the development server.
