import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PositionManager: React.FC = () => {
  const [positions, setPositions] = useState<string[]>([]);
  const [newPosition, setNewPosition] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'settings', 'positions');
        const docSnap = await getDoc(docRef);
        console.log("Firestore document snapshot:", docSnap);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Document data:", data);
          if (data && Array.isArray(data.list)) {
            setPositions(data.list);
          } else {
            console.error("Invalid data structure in Firestore document");
            setError("Invalid data structure in Firestore document");
          }
        } else {
          console.log("No such document!");
          setError("No positions document found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        setError("Error fetching positions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPositions();
  }, []);

  const handleAddPosition = async () => {
    if (newPosition && !positions.includes(newPosition)) {
      const updatedPositions = [...positions, newPosition];
      try {
        await updateDoc(doc(db, 'settings', 'positions'), { list: updatedPositions });
        setPositions(updatedPositions);
        setNewPosition('');
      } catch (error) {
        console.error("Error adding position:", error);
        setError("Error adding position. Please try again.");
      }
    }
  };

  const handleRemovePosition = async (position: string) => {
    const updatedPositions = positions.filter(p => p !== position);
    try {
      await updateDoc(doc(db, 'settings', 'positions'), { list: updatedPositions });
      setPositions(updatedPositions);
    } catch (error) {
      console.error("Error removing position:", error);
      setError("Error removing position. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading positions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Manage Positions</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newPosition}
          onChange={(e) => setNewPosition(e.target.value)}
          className="flex-grow mr-2 p-2 border rounded"
          placeholder="New position"
        />
        <button
          onClick={handleAddPosition}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add
        </button>
      </div>
      {positions.length > 0 ? (
        <ul className="space-y-2">
          {positions.map((position) => (
            <li key={position} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              {position}
              <button
                onClick={() => handleRemovePosition(position)}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No positions available. Add some positions above.</p>
      )}
    </div>
  );
};

export default PositionManager;
