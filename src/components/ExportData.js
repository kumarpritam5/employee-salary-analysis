import React from 'react';

function ExportData({ employees }) {
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
    <button onClick={exportToCSV} className="export-btn">
      📊 Export to CSV
    </button>
  );
}

export default ExportData;