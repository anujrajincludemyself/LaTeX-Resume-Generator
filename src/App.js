// src/App.js
import React, { useState } from 'react';
import './App.css'; // We will create this file next

function App() {
  const [loading, setLoading] = useState(false);

  // --- 1. STATE MANAGEMENT ---
  // Store all form data in a single state object,
  // pre-filled with data from your resume as a default.
  const [formData, setFormData] = useState({
    name: 'Anuj Raj',
    email: 'anujraj24go@gmail.com',
    phone: '+91-9199455366',
    linkedin: 'https://linkedin.com/in/anujraj24',
    github: 'https://github.com/anujraj24',
    summary: 'IT undergrad with keen interest in Development, DSA, React.js, Tailwind, Kotlin, and Python.\nQuick learner with interest in open-source and real-world projects.',
    
    skills: {
      languages: 'C++, Python, Kotlin, JavaScript',
      web: 'React.js, Flask, Tailwind, HTML, CSS, Streamlit, Express.js, Node.js',
      mobile: 'Android (Jetpack Compose)',
      databases: 'MySQL, MongoDB, SQLAlchemy',
      tools: 'Git, GitHub, VS Code, Figma, Google Colab, Moqups',
      cs_fundamentals: 'DSA (Leetcode + GFG = 70), DBMS, CN, OOPS'
    },
    
    education: [
      {
        institution: 'Rajasthan Technical University, Kota',
        degree: 'B.Tech in Information Technology',
        dates: '2023-Present',
        gpa: 'CGPA: 8.7(Till 4th sem) / 10th, 12th-90%, 86% (CBSE Board)'
      }
    ],

    projects: [
      {
        name: 'Sorting Algorithm Visualizer',
        description: 'Visualizes Bubble, Selection, Insertion sorts with HTML, TailwindCSS, JS.',
        github_link: 'https://github.com/anujraj24/Sorting-Visualizer',
        live_link: 'https://anujraj24.github.io/Sorting-Visualizer/'
      },
      {
        name: 'Exam Seating Arrangement Generator',
        description: 'Streamlit app generating optimized exam seating from Excel; buffer/sparse/dense options. 95% accurate; usable in competitive environments.',
        github_link: 'https://github.com/anujraj24/Exam-Seating-Arrangement',
        live_link: 'https://exam-seating-arrangement.streamlit.app/'
      },
      {
        name: 'Text-to-QR Converter using Flask',
        description: 'Converts text to QR code using Python (qrcode) and SQLAlchemy; deployed on PythonAnywhere.',
        github_link: 'https://github.com/anujraj24/Text-to-QR',
        live_link: 'https://anujraj.pythonanywhere.com/'
      }
    ],
    
    experience: [ // For Internships
      {
        role: 'Research Intern',
        company: 'IIT Patna',
        dates: 'Jun-Jul 2025',
        description: [
          'Worked under Dr. Mayank Agarwal on ML for network security and data analysis.',
          'Developed Seating Arrangement Generator: Generated clash-free seating plans from Excel; buffer/sparse/dense options.',
          'Tech: Python, Streamlit, Pandas, OpenPyXL. Achieved 95% accuracy.'
        ]
      }
    ],

    hackathons: [
      {
        name: 'HackCrux 2025, Google Developer Groups LNMIIT Jaipur',
        organizer: '', // Field not in resume, but good to have
        achievement: '2nd Runner-Up for developing an Digital Twin solution that optimized work with Al integration.'
      }
    ],

    pors: [ // Positions of Responsibility
      {
        role: 'Core Member',
        organization: 'E-Cell, RTU Kota',
        description: [
          'Organized startup events and tech sessions for students.',
          'Led internal coordination and campus outreach.'
        ]
      }
    ],

    certifications: [
      { name: 'Android 14 & Kotlin Development Masterclass (Udemy)' }
    ]
  });

  // --- 2. HANDLER FUNCTIONS ---

  // Simple handler for top-level text inputs
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for nested 'skills' object
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [name]: value }
    }));
  };

  /**
   * Generic handler for items in a list (e.g., projects, education)
   * @param {string} listName - The key in formData (e.g., 'projects')
   * @param {number} index - The index of the item to update
   * @param {Event} e - The input change event
   */
  const handleListItemChange = (listName, index, e) => {
    const { name, value } = e.target;
    const newList = [...formData[listName]];
    newList[index][name] = value;
    setFormData(prev => ({ ...prev, [listName]: newList }));
  };

  /**
   * Generic handler for adding a new blank item to a list
   * @param {string} listName - The key in formData (e.g., 'projects')
   * @param {object} blankItem - The blank object structure to add
   */
  const addListItem = (listName, blankItem) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], blankItem]
    }));
  };

  /**
   * Generic handler for removing an item from a list
   * @param {string} listName - The key in formData (e.g., 'projects')
   * @param {number} index - The index of the item to remove
   */
  const removeListItem = (listName, index) => {
    const newList = formData[listName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [listName]: newList }));
  };

  // Specific handler for the 'description' bullet points in Experience/PORs
  const handleBulletPointChange = (listName, itemIndex, bulletIndex, value) => {
    const newList = [...formData[listName]];
    newList[itemIndex].description[bulletIndex] = value;
    setFormData(prev => ({ ...prev, [listName]: newList }));
  };

  const addBulletPoint = (listName, itemIndex) => {
    const newList = [...formData[listName]];
    newList[itemIndex].description.push('');
    setFormData(prev => ({ ...prev, [listName]: newList }));
  };

  const removeBulletPoint = (listName, itemIndex, bulletIndex) => {
    const newList = [...formData[listName]];
    newList[itemIndex].description = newList[itemIndex].description.filter((_, i) => i !== bulletIndex);
    setFormData(prev => ({ ...prev, [listName]: newList }));
  };


  // --- 3. FORM SUBMISSION ---
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to parse the error message from Flask
        const errData = await response.json().catch(() => ({ error: "PDF generation failed. Check backend logs." }));
        throw new Error(errData.error || 'PDF generation failed.');
      }

      // Handle the PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${formData.name.replace(' ', '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. JSX RENDER ---
  return (
    <div className="container">
      <h1>LaTeX Resume Generator</h1>
      <p>Fill out the fields below to generate a professional PDF resume.</p>
      
      <form onSubmit={handleSubmit}>
        
        {/* --- PERSONAL INFO --- */}
        <div className="section">
          <h2>Personal Info</h2>
          <input name="name" value={formData.name} onChange={handleTextChange} placeholder="Full Name" />
          <input name="email" value={formData.email} onChange={handleTextChange} placeholder="Email" />
          <input name="phone" value={formData.phone} onChange={handleTextChange} placeholder="Phone" />
          <input name="linkedin" value={formData.linkedin} onChange={handleTextChange} placeholder="LinkedIn URL" />
          <input name="github" value={formData.github} onChange={handleTextChange} placeholder="GitHub URL" />
        </div>
        
        {/* --- SUMMARY --- */}
        <div className="section">
          <h2>Summary</h2>
          <textarea name="summary" value={formData.summary} onChange={handleTextChange} placeholder="Your professional summary..."></textarea>
        </div>

        {/* --- SKILLS --- */}
        <div className="section">
          <h2>Skills</h2>
          <input name="languages" value={formData.skills.languages} onChange={handleSkillChange} placeholder="Languages (e.g., C++, Python)" />
          <input name="web" value={formData.skills.web} onChange={handleSkillChange} placeholder="Web Tech (e.g., React, Flask)" />
          <input name="mobile" value={formData.skills.mobile} onChange={handleSkillChange} placeholder="Mobile Tech (e.g., Android)" />
          <input name="databases" value={formData.skills.databases} onChange={handleSkillChange} placeholder="Databases (e.g., MySQL, MongoDB)" />
          <input name="tools" value={formData.skills.tools} onChange={handleSkillChange} placeholder="Tools (e.g., Git, VS Code)" />
          <input name="cs_fundamentals" value={formData.skills.cs_fundamentals} onChange={handleSkillChange} placeholder="CS Fundamentals (e.g., DSA, OOPS)" />
        </div>

        {/* --- EDUCATION --- */}
        <div className="section">
          <h2>Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="list-item">
              <input name="institution" value={edu.institution} onChange={(e) => handleListItemChange('education', index, e)} placeholder="Institution" />
              <input name="degree" value={edu.degree} onChange={(e) => handleListItemChange('education', index, e)} placeholder="Degree" />
              <input name="dates" value={edu.dates} onChange={(e) => handleListItemChange('education', index, e)} placeholder="Dates (e.g., 2023-Present)" />
              <input name="gpa" value={edu.gpa} onChange={(e) => handleListItemChange('education', index, e)} placeholder="CGPA / Notes" />
              <button type="button" className="remove-item" onClick={() => removeListItem('education', index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('education', { institution: '', degree: '', dates: '', gpa: '' })}>+ Add Education</button>
        </div>

        {/* --- EXPERIENCE / INTERNSHIPS --- */}
        <div className="section">
          <h2>Experience / Internships</h2>
          {formData.experience.map((exp, index) => (
            <div key={index} className="list-item">
              <input name="role" value={exp.role} onChange={(e) => handleListItemChange('experience', index, e)} placeholder="Role (e.g., Research Intern)" />
              <input name="company" value={exp.company} onChange={(e) => handleListItemChange('experience', index, e)} placeholder="Company (e.g., IIT Patna)" />
              <input name="dates" value={exp.dates} onChange={(e) => handleListItemChange('experience', index, e)} placeholder="Dates (e.g., Jun-Jul 2025)" />
              
              <label>Description (Bullet Points):</label>
              {exp.description.map((point, pIndex) => (
                <div key={pIndex} className="bullet-item">
                  <textarea
                    rows="2"
                    value={point}
                    onChange={(e) => handleBulletPointChange('experience', index, pIndex, e.target.value)}
                    placeholder="Bullet point..."
                  />
                  <button type="button" onClick={() => removeBulletPoint('experience', index, pIndex)}>X</button>
                </div>
              ))}
              <button type="button" onClick={() => addBulletPoint('experience', index)}>+ Add Bullet</button>
              <button type="button" className="remove-item" onClick={() => removeListItem('experience', index)}>Remove Experience</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('experience', { role: '', company: '', dates: '', description: [''] })}>+ Add Experience</button>
        </div>

        {/* --- PROJECTS --- */}
        <div className="section">
          <h2>Projects</h2>
          {formData.projects.map((proj, index) => (
            <div key={index} className="list-item">
              <input name="name" value={proj.name} onChange={(e) => handleListItemChange('projects', index, e)} placeholder="Project Name" />
              <input name="github_link" value={proj.github_link} onChange={(e) => handleListItemChange('projects', index, e)} placeholder="GitHub Link" />
              <input name="live_link" value={proj.live_link} onChange={(e) => handleListItemChange('projects', index, e)} placeholder="Live Link" />
              <textarea name="description" value={proj.description} onChange={(e) => handleListItemChange('projects', index, e)} placeholder="Project description..."></textarea>
              <button type="button" className="remove-item" onClick={() => removeListItem('projects', index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('projects', { name: '', description: '', github_link: '', live_link: '' })}>+ Add Project</button>
        </div>

        {/* --- HACKATHONS --- */}
        <div className="section">
          <h2>Hackathons</h2>
          {formData.hackathons.map((hack, index) => (
            <div key={index} className="list-item">
              <input name="name" value={hack.name} onChange={(e) => handleListItemChange('hackathons', index, e)} placeholder="Hackathon Name & Organizer" />
              <input name="achievement" value={hack.achievement} onChange={(e) => handleListItemChange('hackathons', index, e)} placeholder="Achievement (e.g., 2nd Runner-Up)" />
              <button type="button" className="remove-item" onClick={() => removeListItem('hackathons', index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('hackathons', { name: '', achievement: '' })}>+ Add Hackathon</button>
        </div>

        {/* --- POSITIONS OF RESPONSIBILITY --- */}
        <div className="section">
          <h2>Positions of Responsibility</h2>
          {formData.pors.map((por, index) => (
            <div key={index} className="list-item">
              <input name="role" value={por.role} onChange={(e) => handleListItemChange('pors', index, e)} placeholder="Role (e.g., Core Member)" />
              <input name="organization" value={por.organization} onChange={(e) => handleListItemChange('pors', index, e)} placeholder="Organization (e.g., E-Cell, RTU Kota)" />
              <label>Description (Bullet Points):</label>
              {por.description.map((point, pIndex) => (
                <div key={pIndex} className="bullet-item">
                  <textarea
                    rows="2"
                    value={point}
                    onChange={(e) => handleBulletPointChange('pors', index, pIndex, e.target.value)}
                    placeholder="Bullet point..."
                  />
                  <button type="button" onClick={() => removeBulletPoint('pors', index, pIndex)}>X</button>
                </div>
              ))}
              <button type="button" onClick={() => addBulletPoint('pors', index)}>+ Add Bullet</button>
              <button type="button" className="remove-item" onClick={() => removeListItem('pors', index)}>Remove Position</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('pors', { role: '', organization: '', description: [''] })}>+ Add Position</button>
        </div>

        {/* --- CERTIFICATIONS --- */}
        <div className="section">
          <h2>Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="list-item">
              <input name="name" value={cert.name} onChange={(e) => handleListItemChange('certifications', index, e)} placeholder="Certification Name (e.g., Android 14 Masterclass (Udemy))" />
              <button type="button" className="remove-item" onClick={() => removeListItem('certifications', index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('certifications', { name: '' })}>+ Add Certification</button>
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Generating PDF...' : 'Generate PDF Resume'}
        </button>
      </form>
    </div>
  );
}

export default App;