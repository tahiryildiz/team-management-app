import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Department } from '../../types/Department';
import { Member } from '../../types/Member';

interface DepartmentStatisticsProps {
  departments: Department[];
  members: Member[];
}

const DepartmentStatistics: React.FC<DepartmentStatisticsProps> = ({ departments, members }) => {
  const departmentData = departments.map(dept => {
    const departmentMembers = members.filter(member => member.departmentId === dept.id);
    const averageSalary = departmentMembers.reduce((sum, member) => sum + (member.salary || 0), 0) / departmentMembers.length || 0;
    
    return {
      name: dept.name,
      memberCount: departmentMembers.length,
      averageSalary: Math.round(averageSalary)
    };
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Department Statistics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={departmentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="memberCount" fill="#8884d8" name="Member Count" />
          <Bar yAxisId="right" dataKey="averageSalary" fill="#82ca9d" name="Average Salary" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentStatistics;
