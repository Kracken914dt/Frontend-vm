import React from 'react';
import { FiHome, FiPlusSquare, FiFileText, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { icon: <FiHome className="w-5 h-5" />, label: 'Dashboard', to: '/' },
    { icon: <FiPlusSquare className="w-5 h-5" />, label: 'Crear VM', to: '/crear-vm' },
    { icon: <FiFileText className="w-5 h-5" />, label: 'Logs', to: '/logs' },
    { icon: <FiSettings className="w-5 h-5" />, label: 'Configuración', to: '/configuracion' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-slate-900 w-64 border-r border-slate-800 flex flex-col sidebar`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-violet-600 rounded-md flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="ml-3 text-lg font-semibold text-slate-100">VM Manager</span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="lg:hidden text-slate-400 hover:text-slate-200 focus:outline-none"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
            >
              <span className="text-slate-400">
                {item.icon}
              </span>
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800">
          <FiLogOut className="w-5 h-5 text-slate-400" />
          <span className="ml-3">Salir</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
