import React from 'react';

const Logs = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const ctrl = new AbortController();
    const normalize = (arr) => arr.map((it) => {
      const typeRaw = it.type ?? it.level ?? (it.success === false ? 'error' : 'info');
      const t = String(typeRaw).toLowerCase();
      const type = t.includes('error') || it.success === false ? 'error' : t.includes('warn') ? 'warn' : t.includes('success') || it.success === true ? 'success' : 'info';
      const actor = it.actor ?? '-';
      const action = it.action ?? it.event ?? '-';
      const provider = it.provider ?? it.cloud ?? '-';
      const vm = it.vm_id ?? it.vm ?? it.id ?? '-';
      const name = it.details?.name ? ` (${it.details.name})` : '';
      const text = it.text ?? it.message ?? it.msg ?? `${actor} ${action} ${vm} [${provider}]${name}`;
      const ts = it.timestamp ?? it.time ?? it.date ?? null;
      return { type, text, timestamp: ts };
    });
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/logs', { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          const arr = Array.isArray(data) ? data : (data?.items || data?.logs || []);
          setItems(normalize(arr));
        } else {
          // NDJSON or plain text lines
          const text = await res.text();
          const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
          const arr = [];
          for (const line of lines) {
            try { arr.push(JSON.parse(line)); } catch (_) { /* skip non-JSON lines */ }
          }
          setItems(normalize(arr));
        }
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'No se pudieron cargar los logs');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, []);

  const color = {
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-600/30',
    info: 'bg-amber-500/20 text-amber-300 border-amber-600/30',
    warn: 'bg-yellow-500/20 text-yellow-300 border-yellow-600/30',
    error: 'bg-rose-500/20 text-rose-300 border-rose-600/30',
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Logs / Estado</h2>
        {loading && <span className="text-xs text-slate-400">Cargando...</span>}
      </div>
      {!!error && (
        <div className="mb-3 rounded-lg px-3 py-2 border bg-rose-500/20 text-rose-200 border-rose-600/30">{error}</div>
      )}
      <div className="space-y-3 max-h-[60vh] overflow-auto">
        {items.length === 0 && !loading && !error && (
          <div className="text-sm text-slate-400">No hay logs para mostrar.</div>
        )}
        {items.map((it, idx) => (
          <div key={idx} className={`rounded-lg px-3 py-2 border ${color[it.type] || color.info}`}>
            <div className="flex items-center justify-between gap-3">
              <span>{it.text}</span>
              {it.timestamp && <span className="text-[11px] text-slate-400 whitespace-nowrap">{String(it.timestamp)}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
