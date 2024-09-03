import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Department } from '../types/Department';
import { Member } from '../types/Member';
import MemberDetailsModal from '../components/MemberDetailsModal';
import { useNavigate } from 'react-router-dom';

const DepartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentAndMembers = async () => {
      if (!id) return;

      // Fetch department
      const departmentDoc = await getDoc(doc(db, 'departments', id));
      if (departmentDoc.exists()) {
        setDepartment({ id, ...departmentDoc.data() } as Department);
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

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const handleEditMember = (member: Member) => {
    // Implement edit logic or navigation
    navigate(`/members/edit/${member.id}`);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'members', memberId));
        setSelectedMember(null);
      } catch (error) {
        console.error('Error deleting member: ', error);
      }
    }
  };

  if (!department) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{department.name}</h1>
      <p className="mb-4">{department.description}</p>
      <h2 className="text-xl font-semibold mb-2">Members</h2>
      <ul className="space-y-2">
        {members.map(member => (
          <li key={member.id} className="bg-white shadow rounded p-2">
            <button
              onClick={() => handleMemberClick(member)}
              className="text-blue-500 hover:underline"
            >
              {member.name} - {member.position}
            </button>
          </li>
        ))}
      </ul>
      {members.length === 0 && <p>No members in this department.</p>}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          department={department} // Add this line
          onClose={handleCloseModal}
          onEdit={() => handleEditMember(selectedMember)}
          onDelete={() => handleDeleteMember(selectedMember.id)}
        />
      )}
    </div>
  );
};

export default DepartmentDetails;
