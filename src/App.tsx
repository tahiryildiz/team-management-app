import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Home from './pages/Home';
import Departments from './pages/Departments';
import Members from './pages/Members';
import Settings from './pages/Settings';
import BottomTabNav from './components/BottomTabNav';
import DepartmentMembers from './pages/DepartmentMembers';

const App: React.FC = () => {
  return (
    <Router>
      <SettingsProvider>
        <div className="pb-16"> {/* Add padding to the bottom to account for the navigation */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentMembers />} />
            <Route path="/members" element={<Members />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <BottomTabNav />
      </SettingsProvider>
    </Router>
  );
};

export default App;
