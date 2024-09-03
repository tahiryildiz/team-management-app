import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Member } from '../types/Member';
import { Department } from '../types/Department';
import PageTitle from '../components/PageTitle';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberDepartmentId, setNewMemberDepartmentId] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  useEffect(() => {
    const membersQuery = query(collection(db, 'members'));
    const unsubscribeMembers = onSnapshot(membersQuery, (querySnapshot) => {
      const membersData: Member[] = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ id: doc.id, ...doc.data() } as Member);
      });
      setMembers(membersData);
    });

    const departmentsQuery = query(collection(db, 'departments'));
    const unsubscribeDepartments = onSnapshot(departmentsQuery, (querySnapshot) => {
      const departmentsData: Department[] = [];
      querySnapshot.forEach((doc) => {
        departmentsData.push({ id: doc.id, ...doc.data() } as Department);
      });
      setDepartments(departmentsData);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeDepartments();
    };
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim() === '' || newMemberEmail.trim() === '' || newMemberDepartmentId === '') return;

    try {
      await addDoc(collection(db, 'members'), {
        name: newMemberName,
        email: newMemberEmail,
        departmentId: newMemberDepartmentId,
      });
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberDepartmentId('');
    } catch (error) {
      console.error('Error adding member: ', error);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setNewMemberName(member.name);
    setNewMemberEmail(member.email || ''); // Handle possible undefined email
    setNewMemberDepartmentId(member.departmentId);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || newMemberName.trim() === '' || newMemberEmail.trim() === '' || newMemberDepartmentId === '') return;

    try {
      await updateDoc(doc(db, 'members', editingMember.id), {
        name: newMemberName,
        email: newMemberEmail,
        departmentId: newMemberDepartmentId,
      });
      setEditingMember(null);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberDepartmentId('');
    } catch (error) {
      console.error('Error updating member: ', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'members', id));
      } catch (error) {
        console.error('Error deleting member: ', error);
      }
    }
  };

  return (
    <div className="p-4">
      <PageTitle pageName="Members" includeCompanyName={true} />
      
      {/* List of members */}
      <ul className="mb-4">
        {members.map((member) => (
          <li key={member.id} className="mb-2 p-2 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.email}</p>
                <p className="text-sm text-gray-600">
                  Department: {departments.find(d => d.id === member.departmentId)?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(member)}
                  className="mr-2 text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Form for adding/editing members */}
      <form onSubmit={editingMember ? handleUpdate : handleAddMember} className="mb-4">
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="Member name"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="Member email"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <select
          value={newMemberDepartmentId}
          onChange={(e) => setNewMemberDepartmentId(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="">Select a department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingMember ? 'Update Member' : 'Add Member'}
        </button>
        {editingMember && (
          <button
            type="button"
            onClick={() => {
              setEditingMember(null);
              setNewMemberName('');
              setNewMemberEmail('');
              setNewMemberDepartmentId('');
            }}
            className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default Members;


