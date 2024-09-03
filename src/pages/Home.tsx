import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import PageTitle from '../components/PageTitle';
import DepartmentStatistics from '../components/Dashboard/DepartmentStatistics';
import { Department } from '../types/Department';
import { Member } from '../types/Member';

const Home: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

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

  return (
    <div className="p-4">
      <PageTitle pageName="Dashboard" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Total Departments</h2>
          <p className="text-3xl font-bold">{departments.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Total Members</h2>
          <p className="text-3xl font-bold">{members.length}</p>
        </div>
      </div>
      <DepartmentStatistics departments={departments} members={members} />
    </div>
  );
};

export default Home;
