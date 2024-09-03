import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        <NavItem to="/" icon={<HomeIcon className="w-6 h-6" />} active={location.pathname === '/'} label="Home" />
        <NavItem to="/departments" icon={<UsersIcon className="w-6 h-6" />} active={location.pathname === '/departments'} label="Departments" />
        <NavItem to="/members" icon={<UserGroupIcon className="w-6 h-6" />} active={location.pathname === '/members'} label="Members" />
        <NavItem to="/settings" icon={<CogIcon className="w-6 h-6" />} active={location.pathname === '/settings'} label="Settings" />
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, active, label }) => (
  <Link to={to} className={`flex flex-col items-center p-2 ${active ? 'text-blue-500' : 'text-gray-500'}`}>
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default BottomNavigation;
