import React from 'react';
import { Member } from '../../types/Member';
import { Department } from '../../types/Department';

interface MemberListProps {
  members: Member[];
  departments: Department[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, departments, onEdit, onDelete }) => {
  return (
    <ul className="space-y-4">
      {members.map((member) => {
        const department = departments.find(d => d.id === member.departmentId);
        return (
          <li key={member.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
                <p className="text-sm text-gray-500">Department: {department?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Email: {member.email}</p>
                <p className="text-sm text-gray-500">Phone: {member.phone}</p>
              </div>
              <div>
                <button
                  onClick={() => onEdit(member)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MemberList;


