import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, query, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Department } from '../../types/Department';
import { stringSimilarity } from '../../utils/stringSimilarity';

interface DepartmentFormProps {
  department?: Department;
  onClose: () => void;
  onSubmit: (success: boolean) => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, onClose, onSubmit }) => {
  const [name, setName] = useState(department?.name || '');
  const [description, setDescription] = useState(department?.description || '');
  const [error, setError] = useState('');
  const [similarDepartments, setSimilarDepartments] = useState<Department[]>([]);

  const checkSimilarDepartments = async (departmentName: string) => {
    const departmentsRef = collection(db, 'departments');
    const querySnapshot = await getDocs(departmentsRef);
    const similar: Department[] = [];

    querySnapshot.forEach((doc) => {
      const dept = { id: doc.id, ...doc.data() } as Department;
      if (dept.id !== department?.id) {
        const similarity = stringSimilarity(departmentName.toLowerCase(), dept.name.toLowerCase());
        if (similarity > 0.8) {
          similar.push(dept);
        }
      }
    });

    setSimilarDepartments(similar);
  };

  useEffect(() => {
    if (name.trim()) {
      checkSimilarDepartments(name);
    } else {
      setSimilarDepartments([]);
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Department name is required');
      return;
    }

    if (similarDepartments.length > 0) {
      setError('A similar department already exists. Please check the list below.');
      return;
    }

    try {
      if (department) {
        await updateDoc(doc(db, 'departments', department.id), { name, description });
      } else {
        await addDoc(collection(db, 'departments'), { name, description });
      }
      onSubmit(true);
    } catch (error) {
      console.error('Error saving department: ', error);
      onSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Department Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          placeholder="Department Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      {similarDepartments.length > 0 && (
        <div className="mb-4">
          <p className="text-yellow-600 font-bold">Similar departments found:</p>
          <ul className="list-disc pl-5">
            {similarDepartments.map((dept) => (
              <li key={dept.id}>{dept.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {department ? 'Update' : 'Create'} Department
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
