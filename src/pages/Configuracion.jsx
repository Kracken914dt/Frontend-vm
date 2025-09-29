import React from 'react';

const Configuracion = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Configuración</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-slate-300">Tema</span>
            <select className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Oscuro</option>
              <option>Claro</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Idioma</span>
            <select className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Español</option>
              <option>English</option>
            </select>
          </label>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-slate-200 font-medium mb-3">Notificaciones</h3>
        <div className="space-y-3">
          {['Creación de VM', 'Errores', 'Actualizaciones', 'Alertas de costo'].map((label, idx) => (
            <label key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-700">
              <span className="text-slate-300">{label}</span>
              <input type="checkbox" defaultChecked className="accent-violet-600" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
