import React from 'react';

const Logs = () => {
  const items = [
    { type: 'success', text: 'VM #vm-1025 iniciada correctamente.' },
    { type: 'info', text: 'Creando VM "ml-worker-2" en GCP...' },
    { type: 'error', text: 'Error: No se pudo detener vm #vm-1026.' },
  ];

  const color = {
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-600/30',
    info: 'bg-amber-500/20 text-amber-300 border-amber-600/30',
    error: 'bg-rose-500/20 text-rose-300 border-rose-600/30',
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">Logs / Estado</h2>
      <div className="space-y-3 max-h-[60vh] overflow-auto">
        {items.map((it, idx) => (
          <div key={idx} className={`rounded-lg px-3 py-2 border ${color[it.type]}`}>{it.text}</div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
