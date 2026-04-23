import React, { useState } from 'react';
import Papa from 'papaparse';

function DataUpload({ onDataUpload }) {
  const [uploadMethod, setUploadMethod] = useState('form');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const formatted = results.data.map(row => ({
          emp_id: parseInt(row.emp_id) || Date.now() + Math.random(),
          name: row.name,
          department: row.department,
          experience: parseInt(row.experience),
          salary: parseInt(row.salary),
          city: row.city
        })).filter(emp => emp.name);
        
        onDataUpload(formatted);
        alert(`✅ Successfully imported ${formatted.length} employees!`);
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newEmployee = {
      emp_id: Date.now(),
      name: formData.get('name'),
      department: formData.get('department'),
      experience: parseInt(formData.get('experience')),
      salary: parseInt(formData.get('salary')),
      city: formData.get('city')
    };
    
    onDataUpload([newEmployee]);
    e.target.reset();
    alert('✅ Employee added successfully!');
  };

  return (
    <div className="upload-container">
      <div className="upload-tabs">
        <button 
          className={`tab-btn ${uploadMethod === 'form' ? 'active' : ''}`}
          onClick={() => setUploadMethod('form')}
        >
          <span className="tab-icon">✏️</span>
          <span>Manual Entry</span>
        </button>
        <button 
          className={`tab-btn ${uploadMethod === 'file' ? 'active' : ''}`}
          onClick={() => setUploadMethod('file')}
        >
          <span className="tab-icon">📂</span>
          <span>Bulk Upload</span>
        </button>
      </div>

      <div className="upload-content">
        {uploadMethod === 'form' && (
          <div className="form-section">
            <div className="form-header">
              <h3>Add Individual Employee</h3>
              <p>Fill in the details below to add a new employee record</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="employee-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee Name</label>
                  <input 
                    name="name" 
                    placeholder="Enter full name" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select name="department" required>
                    <option value="">Choose department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Years of Experience</label>
                  <input 
                    name="experience" 
                    type="number" 
                    placeholder="0-50" 
                    min="0"
                    max="50"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Annual Salary (₹)</label>
                  <input 
                    name="salary" 
                    type="number" 
                    placeholder="e.g., 60000" 
                    min="0"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input 
                    name="city" 
                    placeholder="Enter city name" 
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                ➕ Add Employee
              </button>
            </form>
          </div>
        )}

        {uploadMethod === 'file' && (
          <div className="file-section">
            <div className="form-header">
              <h3>Bulk Import from CSV</h3>
              <p>Upload a CSV file to import multiple employee records at once</p>
            </div>

            <div 
              className={`drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="drop-icon">📤</div>
              <h4>Drag & Drop CSV File Here</h4>
              <p>or click to browse</p>
              <input 
                type="file" 
                accept=".csv" 
                onChange={(e) => handleFileUpload(e.target.files[0])}
                id="csvUpload"
                style={{ display: 'none' }}
              />
              <label htmlFor="csvUpload" className="browse-btn">
                Choose File
              </label>
            </div>

            <div className="csv-instructions">
              <h4>📋 CSV Format Requirements</h4>
              <div className="instruction-box">
                <p><strong>Required columns:</strong></p>
                <code>emp_id, name, department, experience, salary, city</code>
                
                <p><strong>Example:</strong></p>
                <div className="csv-example">
                  <pre>
emp_id,name,department,experience,salary,city
101,John Doe,IT,5,60000,Mumbai
102,Jane Smith,HR,7,55000,Delhi
103,Mike Johnson,Finance,3,45000,Bangalore
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataUpload;