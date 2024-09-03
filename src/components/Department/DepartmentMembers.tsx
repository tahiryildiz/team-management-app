import React from 'react';
import { Member } from '../../types/Member';

interface DepartmentMembersProps {
  members: Member[];
  onClose: () => void;
}

const DepartmentMembers: React.FC<DepartmentMembersProps> = ({ members, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Department Members</h3>
          <div className="mt-2 px-7 py-3">
            {members.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {members.map((member) => (
                  <li key={member.id} className="py-4">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.position}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No members in this department.</p>
            )}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMembers;
