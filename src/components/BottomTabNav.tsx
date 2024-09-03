import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';

const BottomTabNav: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/departments', icon: UserGroupIcon, label: 'Departments' },
    { path: '/members', icon: UserIcon, label: 'Members' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center py-2 px-3 ${
              location.pathname === tab.path ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabNav;
