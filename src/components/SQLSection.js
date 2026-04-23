import React from 'react';
import { sqlAnalyzer } from '../utils/sqlAnalyzer';

function SQLSection({ employees }) {
  const avgSalary = sqlAnalyzer.getAverageSalary(employees);
  const highestPaid = sqlAnalyzer.getHighestPaid(employees);
  const deptSalaries = sqlAnalyzer.getDepartmentSalaries(employees);
  const experienced = sqlAnalyzer.getExperiencedEmployees(employees);

  return (
    <section className="sql-section">
      <h2>🔍 SQL Analysis Results</h2>
      
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>Average Company Salary</h3>
          <p className="big-number">₹{avgSalary.toLocaleString()}</p>
          <code>SELECT AVG(salary) FROM employees</code>
        </div>

        <div className="analysis-card">
          <h3>Highest Paid Employee</h3>
          <p className="big-number">{highestPaid.name}</p>
          <p>₹{highestPaid.salary.toLocaleString()} • {highestPaid.department}</p>
          <code>SELECT * FROM employees ORDER BY salary DESC LIMIT 1</code>
        </div>

        <div className="analysis-card">
          <h3>Experienced Employees (5+ years)</h3>
          <p className="big-number">{experienced.length}</p>
          <code>SELECT * FROM employees WHERE experience &gt; 5</code>
        </div>
      </div>

      <div className="dept-salary-table">
        <h3>Department-wise Average Salary</h3>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Avg Salary</th>
              <th>Employees</th>
            </tr>
          </thead>
          <tbody>
            {deptSalaries.map(dept => (
              <tr key={dept.department}>
                <td>{dept.department}</td>
                <td>₹{dept.avgSalary.toLocaleString()}</td>
                <td>{dept.employees}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <code>SELECT department, AVG(salary) FROM employees GROUP BY department</code>
      </div>
    </section>
  );
}

export default SQLSection;
