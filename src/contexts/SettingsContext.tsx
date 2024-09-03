import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

export interface Settings {
  currency: string;
  companyName: string;
  // Add other settings as needed
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({ 
    currency: 'USD',
    companyName: ''  // Add an initial empty string for companyName
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const settingsDoc = await getDoc(doc(db, 'settings', user.uid));
        if (settingsDoc.exists()) {
          const fetchedSettings = settingsDoc.data() as Settings;
          setSettings(prevSettings => ({
            ...prevSettings,
            ...fetchedSettings
          }));
        }
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
