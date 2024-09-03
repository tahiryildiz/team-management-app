import { Member } from '../types/Member';
import { Department } from '../types/Department';

export const membersToCsv = (members: Member[], departments: Department[]): string => {
  const headers = ['Name', 'Position', 'Department', 'Email', 'Phone', 'Hire Date', 'Salary'];
  const rows = members.map(member => {
    const department = departments.find(d => d.id === member.departmentId);
    return [
      member.name,
      member.position,
      department ? department.name : 'N/A',
      member.email,
      member.phone || '',
      member.hireDate || '',
      member.salary?.toString() || ''
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCsv = (filename: string, csvContent: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
