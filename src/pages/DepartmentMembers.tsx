import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member } from '../types/Member';
import { Department } from '../types/Department';
import MemberDetailsModal from '../components/MemberDetailsModal';
import MemberModal from '../components/MemberModal';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';

const DepartmentMembers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [department, setDepartment] = useState<Department | undefined>(undefined);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchDepartmentAndMembers = async () => {
      if (!id) return;

      // Fetch department
      const departmentDocRef = doc(db, 'departments', id);
      const departmentDocSnap = await getDoc(departmentDocRef);
      if (departmentDocSnap.exists()) {
        setDepartment({ id, ...departmentDocSnap.data() } as Department);
      }

      // Fetch members
      const membersQuery = query(collection(db, 'members'), where('departmentId', '==', id));
      const querySnapshot = await getDocs(membersQuery);
      const membersData: Member[] = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(membersData);
    };

    fetchDepartmentAndMembers();
  }, [id]);

  const handleAddMember = () => {
    setEditingMember(null);
    setShowAddMemberModal(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowAddMemberModal(true);
  };

  const handleSaveMember = async (memberData: Partial<Member>) => {
    try {
      if (editingMember) {
        await updateDoc(doc(db, 'members', editingMember.id), memberData);
        setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...memberData } : m));
      } else {
        const newMemberRef = await addDoc(collection(db, 'members'), { ...memberData, departmentId: id });
        const newMember = { id: newMemberRef.id, ...memberData, departmentId: id } as Member;
        setMembers([...members, newMember]);
      }
      setShowAddMemberModal(false);
    } catch (error) {
      console.error('Error saving member: ', error);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'members', memberId));
        setMembers(members.filter(m => m.id !== memberId));
        setSelectedMember(null);
      } catch (error) {
        console.error('Error deleting member: ', error);
      }
    }
  };

  return (
    <div className="p-4">
      <Link to="/departments" className="flex items-center text-blue-500 hover:text-blue-700 mb-4">
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        Back to Departments
      </Link>
      {department && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{department.name} Members</h1>
          <button
            onClick={handleAddMember}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
      )}
      <ul className="bg-white rounded-lg shadow overflow-hidden">
        {members.map((member, index) => (
          <li
            key={member.id}
            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
              index !== members.length - 1 ? 'border-b border-gray-200' : ''
            }`}
            onClick={() => setSelectedMember(member)}
          >
            <div className="flex items-center">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-lg font-semibold text-gray-600">{member.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.position || 'No position'}</p>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </li>
        ))}
      </ul>
      {members.length === 0 && (
        <p className="text-gray-500">No members found in this department.</p>
      )}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          department={department}
          onClose={() => setSelectedMember(null)}
          onEdit={() => handleEditMember(selectedMember)}
          onDelete={() => handleDeleteMember(selectedMember.id)}
        />
      )}
      {showAddMemberModal && (
        <MemberModal
          member={editingMember}
          departments={department ? [department] : []} // Pass current department as an array
          onClose={() => setShowAddMemberModal(false)}
          onSave={handleSaveMember}
          currentDepartmentId={id}
        />
      )}
    </div>
  );
};

export default DepartmentMembers;
