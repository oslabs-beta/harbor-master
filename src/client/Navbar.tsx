// src/components/Navbar.tsx
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className='bg-blue-600 p-4 text-white shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Harbor Master</h1>
        {/* <ul className='flex space-x-4'>
          <li>
            <a href='#home' className='hover:text-gray-300'>
              Home
            </a>
          </li>
          <li>
            <a href='#about' className='hover:text-gray-300'>
              About
            </a>
          </li>
          <li>
            <a href='#services' className='hover:text-gray-300'>
              Services
            </a>
          </li>
          <li>
            <a href='#contact' className='hover:text-gray-300'>
              Contact
            </a>
          </li>
        </ul> */}
      </div>
    </nav>
  );
};

export default Navbar;
