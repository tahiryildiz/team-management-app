import React from 'react';
import { Department } from '../../types/Department';

interface DepartmentListProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments, onEdit, onDelete }) => {
  return (
    <ul className="space-y-4">
      {departments.map((dept) => (
        <li key={dept.id} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{dept.name}</h3>
              <p className="text-gray-600">{dept.description}</p>
              <p className="text-sm text-gray-500 mt-2">Members: {dept.memberCount}</p>
            </div>
            <div>
              <button
                onClick={() => onEdit(dept)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(dept.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DepartmentList;
