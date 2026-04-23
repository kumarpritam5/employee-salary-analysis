import React from 'react';
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { sqlAnalyzer } from '../utils/sqlAnalyzer';

function Charts({ employees }) {
  const deptData = sqlAnalyzer.getDepartmentSalaries(employees);
  
  // Calculate salary distribution for histogram
  const getSalaryDistribution = () => {
    const bins = [
      { range: '20k-30k', min: 20000, max: 30000, count: 0 },
      { range: '30k-40k', min: 30000, max: 40000, count: 0 },
      { range: '40k-50k', min: 40000, max: 50000, count: 0 },
      { range: '50k-60k', min: 50000, max: 60000, count: 0 },
      { range: '60k-70k', min: 60000, max: 70000, count: 0 },
      { range: '70k-80k', min: 70000, max: 80000, count: 0 },
      { range: '80k-90k', min: 80000, max: 90000, count: 0 },
      { range: '90k-100k', min: 90000, max: 100000, count: 0 },
      { range: '100k+', min: 100000, max: Infinity, count: 0 }
    ];

    employees.forEach(emp => {
      const bin = bins.find(b => emp.salary >= b.min && emp.salary < b.max);
      if (bin) bin.count++;
    });

    return bins.filter(bin => bin.count > 0);
  };

  // Calculate city-wise average salary
  const getCitySalaries = () => {
    const cityMap = {};
    
    employees.forEach(emp => {
      if (!cityMap[emp.city]) {
        cityMap[emp.city] = { total: 0, count: 0 };
      }
      cityMap[emp.city].total += emp.salary;
      cityMap[emp.city].count += 1;
    });

    return Object.keys(cityMap).map(city => ({
      city: city,
      avgSalary: Math.round(cityMap[city].total / cityMap[city].count),
      employees: cityMap[city].count
    })).sort((a, b) => b.avgSalary - a.avgSalary); // Sort by salary descending
  };

  const salaryDistribution = getSalaryDistribution();
  const citySalaries = getCitySalaries();

  // Colors for charts
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];
  const CITY_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

  return (
    <section className="charts-section">
      <h2>📈 Visual Analytics</h2>
      
      <div className="chart-grid-four">
        {/* 1. Department Salary Comparison */}
        <div className="chart-container">
          <h3>💼 Department Salary Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ background: '#fff', border: '2px solid #667eea', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="avgSalary" fill="#667eea" name="Avg Salary" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Salary Distribution Histogram */}
        <div className="chart-container">
          <h3>📊 Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} employees`, 'Count']}
                contentStyle={{ background: '#fff', border: '2px solid #764ba2', borderRadius: '8px' }}
              />
              <Bar dataKey="count" name="Employees" radius={[8, 8, 0, 0]}>
                {salaryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Experience vs Salary Scatter */}
        <div className="chart-container">
          <h3>🎯 Experience vs Salary Correlation</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="experience" 
                name="Experience" 
                unit=" yrs"
              />
              <YAxis 
                dataKey="salary" 
                name="Salary"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => {
                  if (name === 'Salary') return `₹${value.toLocaleString()}`;
                  return `${value} years`;
                }}
                contentStyle={{ background: '#fff', border: '2px solid #764ba2', borderRadius: '8px' }}
              />
              <Scatter data={employees} fill="#764ba2" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 4. City-wise Salary Analysis */}
        <div className="chart-container">
          <h3>🌍 City-wise Average Salary</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={citySalaries} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="city" type="category" width={80} />
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ background: '#fff', border: '2px solid #e74c3c', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="avgSalary" name="Avg Salary" radius={[0, 8, 8, 0]}>
                {citySalaries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CITY_COLORS[index % CITY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-insight">
            <p>💡 <strong>{citySalaries[0]?.city}</strong> has the highest average salary at <strong>₹{citySalaries[0]?.avgSalary.toLocaleString()}</strong></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Charts;