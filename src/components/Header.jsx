import React, { useEffect, useState } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { api } from '../services/api';

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
        
        <div>
          <HealthBadge />
        </div>
      </div>
    </header>
  );
};

export default Header;

const HealthBadge = () => {
  const [state, setState] = useState({ status: 'loading', text: '...' });

  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      try {
        const res = await api.health();
        if (!mounted) return;
        const text = typeof res === 'string' ? res : (res?.status || 'ok');
        setState({ status: 'ok', text });
      } catch (e) {
        if (!mounted) return;
        setState({ status: 'down', text: e?.message || 'down' });
      }
    };
    fetchHealth();
    const id = setInterval(fetchHealth, 10000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const color = state.status === 'ok' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-600/30' : (state.status === 'loading' ? 'bg-amber-500/20 text-amber-300 border-amber-600/30' : 'bg-rose-500/20 text-rose-300 border-rose-600/30');
  const label = state.status === 'ok' ? 'Online' : (state.status === 'loading' ? 'Cargando' : 'Offline');

  return (
    <div className={`px-2.5 py-1 text-xs rounded-full border ${color}`} title={state.text}>
      API: {label}
    </div>
  );
};
