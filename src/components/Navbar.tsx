import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">Team Management</Link>
        <div>
          <Link to="/departments" className="text-white mr-4">Departments</Link>
          <Link to="/members" className="text-white">Members</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
