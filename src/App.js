import React, { useState, useEffect } from 'react';
import { sampleEmployees } from './data/employees';
import SQLSection from './components/SQLSection';
import Charts from './components/Charts';
import DataUpload from './components/DataUpload';
import SQLQueryEditor from './components/SQLQueryEditor';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
const [employees, setEmployees] = useState(sampleEmployees);

useEffect(() => {
  // Check if we should use saved data or fresh sample data
  const useSampleData = true; // Set to false to use localStorage
  
  if (useSampleData) {
    setEmployees(sampleEmployees);
    localStorage.setItem('employees', JSON.stringify(sampleEmployees));
  } else {
    const saved = localStorage.getItem('employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    }
  }
}, []);

// Add this new function
const resetToSampleData = () => {
  if (window.confirm('Reset to original sample data? This will delete all added employees.')) {
    setEmployees(sampleEmployees);
    localStorage.removeItem('employees');
    alert('✅ Data reset to original sample!');
  }
};

  const handleDataUpload = (newData) => {
    const updated = [...employees, ...newData];
    setEmployees(updated);
    localStorage.setItem('employees', JSON.stringify(updated));
  };

  const exportToCSV = () => {
    const headers = ['emp_id', 'name', 'department', 'experience', 'salary', 'city'];
    const csvContent = [
      headers.join(','),
      ...employees.map(emp => 
        `${emp.emp_id},${emp.name},${emp.department},${emp.experience},${emp.salary},${emp.city}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_data.csv';
    a.click();
  };

  return (
    <div className="App">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">
          <h2>📊 HR Analytics</h2>
          <p>Professional Dashboard</p>
        </div>
        
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="icon">📈</span> Dashboard
          </button>
          <button 
            className={activeTab === 'data' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('data')}
          >
            <span className="icon">👥</span> Employee Data
          </button>
          <button 
            className={activeTab === 'sql' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('sql')}
          >
            <span className="icon">💻</span> SQL Analysis
          </button>
          <button 
            className={activeTab === 'query' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('query')}
          >
            <span className="icon">⚡</span> Query Editor
          </button>
          <button 
            className={activeTab === 'upload' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('upload')}
          >
            <span className="icon">📥</span> Import Data
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={exportToCSV} className="export-btn">
            📊 Export CSV
          </button>
          <button onClick={resetToSampleData} className="reset-btn">
            🔄 Reset Data
          </button>
          <p className="stats">Total: {employees.length} employees</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <h1>
            {activeTab === 'dashboard' && '📊 Analytics Dashboard'}
            {activeTab === 'data' && '👥 Employee Records'}
            {activeTab === 'sql' && '💻 SQL Analysis'}
            {activeTab === 'query' && '⚡ Custom SQL Query'}
            {activeTab === 'upload' && '📥 Data Management'}
          </h1>
          <div className="header-actions">
            <span className="badge">Live Data</span>
            <span className="user-badge">👤 Admin</span>
          </div>
        </header>

        <div className="content-wrapper">
          {activeTab === 'dashboard' && (
            <>
              <Charts employees={employees} />
              <SQLSection employees={employees} />
            </>
          )}

          {activeTab === 'data' && (
            <section className="data-section">
              <div className="section-header">
                <h2>Employee Records</h2>
                <div className="section-actions">
                  <input 
                    type="text" 
                    placeholder="🔍 Search employees..." 
                    className="search-input"
                  />
                  <span className="count-badge">{employees.length} total</span>
                </div>
              </div>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Experience</th>
                      <th>Salary</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.emp_id}>
                        <td><span className="id-badge">{emp.emp_id}</span></td>
                        <td><strong>{emp.name}</strong></td>
                        <td>
                          <span className={`dept-badge dept-${emp.department.toLowerCase()}`}>
                            {emp.department}
                          </span>
                        </td>
                        <td>{emp.experience} years</td>
                        <td className="salary">₹{emp.salary.toLocaleString()}</td>
                        <td>{emp.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'sql' && <SQLSection employees={employees} />}
          
          {activeTab === 'query' && <SQLQueryEditor employees={employees} />}
          
          {activeTab === 'upload' && <DataUpload onDataUpload={handleDataUpload} />}
        </div>
      </main>
    </div>
  );
}

export default App;