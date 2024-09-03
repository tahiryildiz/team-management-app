import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Department } from '../types/Department';
import { Member } from '../types/Member';
import PageTitle from '../components/PageTitle';
import DepartmentModal from '../components/DepartmentModal';
import { PlusIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const departmentsQuery = query(collection(db, 'departments'));
    const unsubscribeDepartments = onSnapshot(departmentsQuery, (querySnapshot) => {
      const departmentsData: Department[] = [];
      querySnapshot.forEach((doc) => {
        departmentsData.push({ id: doc.id, ...doc.data() } as Department);
      });
      setDepartments(departmentsData);
    });

    const membersQuery = query(collection(db, 'members'));
    const unsubscribeMembers = onSnapshot(membersQuery, (querySnapshot) => {
      const membersData: Member[] = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(membersData);
    });

    return () => {
      unsubscribeDepartments();
      unsubscribeMembers();
    };
  }, []);

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  const handleSaveDepartment = async (departmentData: Partial<Department>) => {
    try {
      if (selectedDepartment) {
        await updateDoc(doc(db, 'departments', selectedDepartment.id), departmentData);
      } else {
        await addDoc(collection(db, 'departments'), departmentData);
      }
    } catch (error) {
      console.error('Error saving department: ', error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDoc(doc(db, 'departments', id));
      } catch (error) {
        console.error('Error deleting department: ', error);
      }
    }
  };

  const handleDepartmentClick = (department: Department) => {
    console.log("Navigating to department:", department.id); // Log the department id
    navigate(`/departments/${department.id}`);
  };

  return (
    <div className="p-4">
      <PageTitle pageName="Departments" includeCompanyName={true} />
      
      <div className="mb-4">
        <button
          onClick={handleAddDepartment}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Department
        </button>
      </div>

      {/* List of departments */}
      <ul className="bg-white rounded-lg shadow overflow-hidden">
        {departments.map((department, index) => (
          <li 
            key={department.id} 
            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
              index !== departments.length - 1 ? 'border-b border-gray-200' : ''
            }`}
            onClick={() => handleDepartmentClick(department)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                <span className="text-lg font-semibold text-gray-600">
                  {department.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{department.name}</h3>
                <p className="text-sm text-gray-500">
                  {members.filter(m => m.departmentId === department.id).length} members
                </p>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </li>
        ))}
      </ul>

      {showDepartmentModal && (
        <DepartmentModal
          department={selectedDepartment}
          onClose={() => setShowDepartmentModal(false)}
          onSave={handleSaveDepartment}
        />
      )}
    </div>
  );
};

export default Departments;