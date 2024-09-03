import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { Member } from '../types/Member';
import { Department } from '../types/Department';

const MemberFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Partial<Member>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch departments
      const departmentsSnapshot = await getDocs(collection(db, 'departments'));
      const departmentsData = departmentsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(departmentsData);

      // Fetch positions
      const positionsDoc = await getDoc(doc(db, 'settings', 'positions'));
      if (positionsDoc.exists()) {
        setPositions(positionsDoc.data()?.list || []);
      }

      // Fetch member data if editing
      if (id) {
        const memberDoc = await getDoc(doc(db, 'members', id));
        if (memberDoc.exists()) {
          setMember({ id, ...memberDoc.data() } as Member);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let photoUrl = member.photoUrl;
      if (image) {
        const storageRef = ref(storage, `member-photos/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      const memberData = { ...member, photoUrl };
      if (id) {
        await updateDoc(doc(db, 'members', id), memberData);
      } else {
        await addDoc(collection(db, 'members'), memberData);
      }
      navigate('/members');
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={member.name || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="departmentId" className="block">Department</label>
          <select
            id="departmentId"
            name="departmentId"
            value={member.departmentId || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="position" className="block">Position</label>
          <select
            id="position"
            name="position"
            value={member.position || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={member.email || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={member.phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="hireDate" className="block">Hire Date</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={member.hireDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="salary" className="block">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={member.salary || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="photo" className="block">Photo</label>
          <input
            type="file"
            id="photo"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {id ? 'Update' : 'Add'} Member
        </button>
      </form>
    </div>
  );
};

export default MemberFormPage;