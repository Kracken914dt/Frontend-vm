import React from 'react';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-1 text-slate-400 rounded-md lg:hidden hover:bg-slate-800 focus:outline-none"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="relative ml-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 text-sm bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 text-slate-200 placeholder:text-slate-500"
              placeholder="Buscar..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 rounded-full hover:bg-slate-800 focus:outline-none">
            <FiBell className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 bg-violet-600/20 rounded-full flex items-center justify-center text-violet-400 font-medium">
                JD
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-slate-200">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
