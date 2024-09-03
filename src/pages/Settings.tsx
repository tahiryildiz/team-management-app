import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSettings, Settings } from '../contexts/SettingsContext';
import PositionManager from '../components/PositionManager';

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'SGD', name: 'Singapore Dollar' },
];

const SettingsPage: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [currency, setCurrency] = useState(settings.currency);
    const [companyName, setCompanyName] = useState(settings.companyName);
    const [message, setMessage] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
      setCurrency(settings.currency);
      setCompanyName(settings.companyName);
    }, [settings]);

    const handleSaveCurrency = async () => {
      if (user) {
        try {
          const updatedSettings: Partial<Settings> = { currency };
          await setDoc(doc(db, 'settings', user.uid), updatedSettings, { merge: true });
          updateSettings(updatedSettings);
          setMessage('Currency updated successfully');
        } catch (error) {
          setMessage('Error updating currency: ' + (error as Error).message);
        }
      }
    };

    const handleSaveCompanyName = async (e: React.FormEvent) => {
      e.preventDefault();
      if (user) {
        try {
          const updatedSettings: Partial<Settings> = { companyName };
          await setDoc(doc(db, 'settings', user.uid), updatedSettings, { merge: true });
          updateSettings(updatedSettings);
          setMessage('Company name updated successfully');
        } catch (error) {
          setMessage('Error updating company name: ' + (error as Error).message);
        }
      }
    };

    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Currency</h2>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name} ({curr.code})
              </option>
            ))}
          </select>
          <button 
            onClick={handleSaveCurrency}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Currency
          </button>
        </div>
  
        <form onSubmit={handleSaveCompanyName} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Company Name</h2>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter company name"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Company Name
          </button>
        </form>
  
        <PositionManager />
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">User Agreement</h2>
          <a
            href="/user-agreement.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View User Agreement
          </a>
        </div>
  
        {message && (
          <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
      </div>
    );
  };
  
  export default SettingsPage;