import React from 'react';
import { Member } from '../types/Member';
import { Department } from '../types/Department';
import { XMarkIcon, PhoneIcon, EnvelopeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';
import useImageCache from '../hooks/useImageCache';

interface MemberDetailsModalProps {
  member: Member;
  department: Department | undefined;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({ member, department, onClose, onEdit, onDelete }) => {
  const { settings } = useSettings();
  const placeholderImage = '/path/to/placeholder-image.jpg'; // Replace with your placeholder image path
  const cachedImageSrc = useImageCache(member.photoUrl, placeholderImage);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary: number | undefined) => {
    if (salary === undefined) return 'N/A';
    return new Intl.NumberFormat(undefined, { 
      style: 'currency', 
      currency: settings.currency 
    }).format(salary);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-xl p-6 animate-slide-up overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{member.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          {cachedImageSrc && (
            <div className="flex justify-center">
              <img src={cachedImageSrc} alt={member.name} className="w-32 h-32 rounded-full object-cover" />
            </div>
          )}
          <p><strong>Position:</strong> {member.position || 'N/A'}</p>
          <p><strong>Department:</strong> {department?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {member.email || 'N/A'}
            {member.email && (
              <a href={`mailto:${member.email}`} className="ml-2 text-blue-500 hover:text-blue-700">
                <EnvelopeIcon className="h-5 w-5 inline" />
              </a>
            )}
          </p>
          <p><strong>Phone:</strong> {member.phone || 'N/A'}
            {member.phone && (
              <a href={`tel:${member.phone}`} className="ml-2 text-green-500 hover:text-green-700">
                <PhoneIcon className="h-5 w-5 inline" />
              </a>
            )}
          </p>
          <p><strong>Hire Date:</strong> {formatDate(member.hireDate)}</p>
          <p><strong>Salary:</strong> {formatSalary(member.salary)}</p>
          <p><strong>Birthday:</strong> {formatDate(member.birthday)}</p>
          {member.customFields && Object.entries(member.customFields).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-1" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
