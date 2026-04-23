export const sqlAnalyzer = {
  // Display all employee records
  getAllEmployees: (employees) => {
    return employees;
  },

  // Calculate average salary
  getAverageSalary: (employees) => {
    const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
    return Math.round(total / employees.length);
  },

  // Find highest paid employee
  getHighestPaid: (employees) => {
    return employees.reduce((max, emp) => 
      emp.salary > max.salary ? emp : max
    );
  },

  // Calculate department-wise average salary
  getDepartmentSalaries: (employees) => {
    const deptMap = {};
    
    employees.forEach(emp => {
      if (!deptMap[emp.department]) {
        deptMap[emp.department] = { total: 0, count: 0 };
      }
      deptMap[emp.department].total += emp.salary;
      deptMap[emp.department].count += 1;
    });

    return Object.keys(deptMap).map(dept => ({
      department: dept,
      avgSalary: Math.round(deptMap[dept].total / deptMap[dept].count),
      employees: deptMap[dept].count
    }));
  },

  // Filter employees with experience > 5 years
  getExperiencedEmployees: (employees) => {
    return employees.filter(emp => emp.experience > 5);
  }
};
