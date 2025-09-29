import React from 'react';

const statusBadge = (status) => {
  const map = {
    'en uso': 'bg-emerald-500/15 text-emerald-300',
    'detenida': 'bg-rose-500/15 text-rose-300',
  };
  return <span className={`px-2.5 py-1 text-xs rounded-full ${map[status] || 'bg-slate-600/40 text-slate-300'}`}>{status}</span>;
};

const Dashboard = () => {
  const vms = [
    { id: '#vm-1001', nombre: 'api-core', proveedor: 'AWS', estado: 'en uso' },
    { id: '#vm-1002', nombre: 'ml-worker-2', proveedor: 'GCP', estado: 'detenida' },
    { id: '#vm-1003', nombre: 'search-indexer', proveedor: 'Azure', estado: 'en uso' },
    { id: '#vm-1004', nombre: 'batch-runner', proveedor: 'OnPremise', estado: 'detenida' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-100">Listado</h2>
          <div className="flex gap-3">
            <input className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Buscar por nombre..."/>
            <select className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
              <option>Proveedor: Todos</option>
              <option>AWS</option>
              <option>Azure</option>
              <option>GCP</option>
              <option>OnPremise</option>
            </select>
            <select className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
              <option>Estado: Todos</option>
              <option>en uso</option>
              <option>detenida</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-700">
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
              {vms.map((vm) => (
                <tr key={vm.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-3 text-slate-300">{vm.id}</td>
                  <td className="px-4 py-3 text-slate-100">{vm.nombre}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 text-xs rounded-full bg-slate-700 text-slate-200">{vm.proveedor}</span></td>
                  <td className="px-4 py-3">{statusBadge(vm.estado)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Start</button>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Stop</button>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Restart</button>
                      <button className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500">Editar</button>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {vms.slice(0,2).map(vm => (
          <div key={vm.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700" />
                <div>
                  <h3 className="text-slate-100 font-semibold">{vm.nombre}</h3>
                  <p className="text-xs text-slate-400">ID: {vm.id}</p>
                </div>
              </div>
              {statusBadge(vm.estado)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Start</button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Stop</button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Restart</button>
              <button className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500">Editar</button>
              <button className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
