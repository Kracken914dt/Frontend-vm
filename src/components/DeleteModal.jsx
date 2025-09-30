import React from 'react';

const DeleteModal = ({ open, title = 'Confirmar eliminación', message = '¿Seguro que deseas eliminar esta VM? Esta acción no se puede deshacer.', loading = false, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-60">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-60">{loading ? 'Eliminando...' : 'Eliminar'}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
