import React, { useState } from 'react';

function SQLQueryEditor({ employees }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const executeQuery = () => {
    setError(null);
    setResult(null);

    try {
      const queryLower = query.toLowerCase().trim();

      // SELECT * FROM employees
      if (queryLower.includes('select * from employees') && !queryLower.includes('where')) {
        setResult({ type: 'table', data: employees });
        return;
      }

      // SELECT AVG(salary)
      if (queryLower.includes('avg(salary)')) {
        const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
        const avg = Math.round(total / employees.length);
        setResult({ type: 'value', label: 'Average Salary', value: `₹${avg.toLocaleString()}` });
        return;
      }

      // SELECT MAX(salary)
      if (queryLower.includes('max(salary)')) {
        const max = Math.max(...employees.map(e => e.salary));
        setResult({ type: 'value', label: 'Maximum Salary', value: `₹${max.toLocaleString()}` });
        return;
      }

      // SELECT MIN(salary)
      if (queryLower.includes('min(salary)')) {
        const min = Math.min(...employees.map(e => e.salary));
        setResult({ type: 'value', label: 'Minimum Salary', value: `₹${min.toLocaleString()}` });
        return;
      }

      // SELECT COUNT(*)
      if (queryLower.includes('count(*)')) {
        setResult({ type: 'value', label: 'Total Employees', value: employees.length });
        return;
      }

      // WHERE department = 'X'
      if (queryLower.includes('where department')) {
        const match = query.match(/department\s*=\s*['"](\w+)['"]/i);
        if (match) {
          const dept = match[1];
          const filtered = employees.filter(e => 
            e.department.toLowerCase() === dept.toLowerCase()
          );
          setResult({ type: 'table', data: filtered });
          return;
        }
      }

      // WHERE experience > X
      if (queryLower.includes('where experience >')) {
        const match = query.match(/experience\s*>\s*(\d+)/i);
        if (match) {
          const exp = parseInt(match[1]);
          const filtered = employees.filter(e => e.experience > exp);
          setResult({ type: 'table', data: filtered });
          return;
        }
      }

      // WHERE salary > X
      if (queryLower.includes('where salary >')) {
        const match = query.match(/salary\s*>\s*(\d+)/i);
        if (match) {
          const sal = parseInt(match[1]);
          const filtered = employees.filter(e => e.salary > sal);
          setResult({ type: 'table', data: filtered });
          return;
        }
      }

      // GROUP BY department
      if (queryLower.includes('group by department')) {
        const deptMap = {};
        employees.forEach(emp => {
          if (!deptMap[emp.department]) {
            deptMap[emp.department] = { total: 0, count: 0 };
          }
          deptMap[emp.department].total += emp.salary;
          deptMap[emp.department].count += 1;
        });

        const grouped = Object.keys(deptMap).map(dept => ({
          department: dept,
          avgSalary: Math.round(deptMap[dept].total / deptMap[dept].count),
          employees: deptMap[dept].count
        }));

        setResult({ type: 'grouped', data: grouped });
        return;
      }

      // ORDER BY salary DESC
      if (queryLower.includes('order by salary desc')) {
        const sorted = [...employees].sort((a, b) => b.salary - a.salary);
        setResult({ type: 'table', data: sorted });
        return;
      }

      // ORDER BY experience DESC
      if (queryLower.includes('order by experience desc')) {
        const sorted = [...employees].sort((a, b) => b.experience - a.experience);
        setResult({ type: 'table', data: sorted });
        return;
      }

      setError('Query pattern not recognized. Try examples below.');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const sampleQueries = [
    'SELECT * FROM employees',
    'SELECT AVG(salary) FROM employees',
    'SELECT * FROM employees WHERE department = "IT"',
    'SELECT * FROM employees WHERE experience > 5',
    'SELECT * FROM employees WHERE salary > 60000',
    'SELECT department, AVG(salary) FROM employees GROUP BY department',
    'SELECT * FROM employees ORDER BY salary DESC',
    'SELECT COUNT(*) FROM employees'
  ];

  return (
    <div className="query-editor">
      <div className="editor-section">
        <h3>💻 SQL Query Editor</h3>
        <p className="hint">Write SQL queries to analyze employee data in real-time</p>
        
        <div className="query-input-wrapper">
          <textarea
            className="query-input"
            placeholder="Type your SQL query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="5"
          />
          <button onClick={executeQuery} className="run-btn">
            ▶️ Execute Query
          </button>
        </div>

        <div className="sample-queries">
          <h4>📝 Sample Queries (Click to use)</h4>
          <div className="query-chips">
            {sampleQueries.map((q, i) => (
              <button 
                key={i} 
                className="query-chip"
                onClick={() => setQuery(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="query-error">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="query-result">
          <h3>✅ Query Results</h3>
          
          {result.type === 'value' && (
            <div className="result-value">
              <p className="result-label">{result.label}</p>
              <p className="result-number">{result.value}</p>
            </div>
          )}

          {result.type === 'table' && (
            <div className="table-container">
              <p className="result-info">Found {result.data.length} records</p>
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
                  {result.data.map(emp => (
                    <tr key={emp.emp_id}>
                      <td>{emp.emp_id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.experience} yrs</td>
                      <td>₹{emp.salary.toLocaleString()}</td>
                      <td>{emp.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result.type === 'grouped' && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Average Salary</th>
                    <th>Employees</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map(dept => (
                    <tr key={dept.department}>
                      <td><strong>{dept.department}</strong></td>
                      <td>₹{dept.avgSalary.toLocaleString()}</td>
                      <td>{dept.employees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SQLQueryEditor;