# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Personal Info
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    linkedin = db.Column(db.String(200))
    github = db.Column(db.String(200))
    
    # Text Fields
    summary = db.Column(db.Text)
    
    # JSON Fields to store lists of objects
    # This requires MySQL 5.7+
    education = db.Column(db.JSON)
    skills = db.Column(db.JSON)
    projects = db.Column(db.JSON)
    experience = db.Column(db.JSON) # For Internships
    hackathons = db.Column(db.JSON)
    pors = db.Column(db.JSON)
    certifications = db.Column(db.JSON)

    def __repr__(self):
        return f'<Resume for {self.name}>'