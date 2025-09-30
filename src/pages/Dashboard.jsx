import React from 'react';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { SiGooglecloud, SiOracle } from 'react-icons/si';
import { FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";

const normalizeStatus = (s) => {
  const v = String(s || '').toLowerCase();
  if (['running', 'en uso', 'up', 'started', 'active'].includes(v)) return 'running';
  if (['stopped', 'detenida', 'down', 'stop', 'inactive'].includes(v)) return 'stopped';
  return v || 'unknown';
};

const statusBadge = (status) => {
  const key = normalizeStatus(status);
  const map = {
    'running': 'bg-emerald-500/15 text-emerald-300',
    'stopped': 'bg-rose-500/15 text-rose-300',
  };
  const label = key === 'running' ? 'running' : key === 'stopped' ? 'stopped' : (status || 'unknown');
  return <span className={`px-2.5 py-1 text-xs rounded-full ${map[key] || 'bg-slate-600/40 text-slate-300'}`}>{label}</span>;
};

const ProviderLogo = ({ name }) => {
  const p = String(name || '').toLowerCase();
  const common = 'w-5 h-5';
  if (p.includes('aws')) return <FaAws className={`${common} text-amber-300`} />;
  if (p.includes('azure')) return <VscAzure className={`${common} text-sky-300`} />;
  if (p.includes('gcp') || p.includes('google')) return <SiGooglecloud className={`${common} text-indigo-300`} />;
  if (p.includes('oracle')) return <SiOracle className={`${common} text-red-300`} />;
  // OnPremise or others
  return <div className="w-5 h-5 rounded bg-slate-700" />;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [vms, setVMs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [provFilter, setProvFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listVMs();
      const arr = Array.isArray(data) ? data : (data?.items || []);
      setVMs(arr);
    } catch (e) {
      setError(e?.message || 'No se pudo cargar el listado');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const doAction = async (id, action) => {
    try {
      await api.actionVM(id, action);
      await load();
    } catch (e) {
      alert(`Error al ejecutar acción ${action}: ${e?.message || 'desconocido'}`);
    }
  };

  const doDelete = async (id) => {
    if (!window.confirm('¿Eliminar la VM?')) return;
    try {
      await api.deleteVM(id);
      setVMs(prev => prev.filter(vm => (vm.id ?? vm._id ?? vm.uuid) !== id));
    } catch (e) {
      alert(`Error al eliminar: ${e?.message || 'desconocido'}`);
    }
  };

  const getId = (vm) => vm.id ?? vm._id ?? vm.uuid ?? vm.name ?? 'sin-id';
  const getNombre = (vm) => vm.nombre ?? vm.name ?? vm.vm_name ?? '—';
  const getProveedor = (vm) => vm.proveedor ?? vm.provider ?? vm.cloud ?? '—';
  const getEstado = (vm) => vm.estado ?? vm.status ?? (vm.running ? 'running' : 'stopped');

  const filtered = vms.filter((vm) => {
    const name = String(getNombre(vm)).toLowerCase();
    const prov = String(getProveedor(vm)).toLowerCase();
    const st = normalizeStatus(getEstado(vm));
    const qok = !query || name.includes(query.toLowerCase());
    const pok = !provFilter || prov.includes(provFilter.toLowerCase());
    const sok = !statusFilter || st === statusFilter;
    return qok && pok && sok;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-100">Listado</h2>
          <div className="flex gap-3">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Buscar por nombre..."/>
            <select value={provFilter} onChange={(e)=>setProvFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
              <option value="">Proveedor: Todos</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">GCP</option>
              <option value="onpremise">OnPremise</option>
              <option value="oracle">Oracle</option>
            </select>
            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
              <option value="">Estado: Todos</option>
              <option value="running">running</option>
              <option value="stopped">stopped</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-700">
          {loading && (
            <div className="p-4 text-sm text-slate-300">Cargando...</div>
          )}
          {!!error && (
            <div className="p-4 text-sm text-rose-300 bg-rose-500/10 border-b border-rose-600/30">{error}</div>
          )}
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60 text-slate-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Proveedor</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((vm) => {
                const id = getId(vm);
                return (
                <tr key={id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-3 text-slate-300">{id}</td>
                  <td className="px-4 py-3 text-slate-100">{getNombre(vm)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-full bg-slate-700 text-slate-200">
                      <ProviderLogo name={getProveedor(vm)} />
                      {getProveedor(vm)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(getEstado(vm))}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => doAction(id, 'start')} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Start</button>
                      <button onClick={() => doAction(id, 'stop')} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Stop</button>
                      <button onClick={() => doAction(id, 'restart')} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Restart</button>
                      <button onClick={() => navigate(`/crear-vm/${id}`)} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500">Editar</button>
                      <button onClick={() => doDelete(id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500">Eliminar</button>
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.slice(0,2).map(vm => {
          const id = getId(vm);
          return (
          <div key={id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <ProviderLogo name={getProveedor(vm)} />
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold">{getNombre(vm)}</h3>
                  <p className="text-xs text-slate-400">ID: {id}</p>
                </div>
              </div>
              {statusBadge(getEstado(vm))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => doAction(id, 'start')} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Start</button>
              <button onClick={() => doAction(id, 'stop')} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Stop</button>
              <button onClick={() => doAction(id, 'restart')} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Restart</button>
              <button onClick={() => navigate(`/crear-vm/${id}`)} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500">Editar</button>
              <button onClick={() => doDelete(id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500">Eliminar</button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

