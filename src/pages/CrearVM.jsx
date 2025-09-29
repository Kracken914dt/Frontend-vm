import React from 'react';

const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-sm text-slate-300">{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 ${props.className || ''}`}
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 ${props.className || ''}`}
  >
    {children}
  </select>
);

const CrearVM = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Crear / Editar VM</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nombre de la VM">
              <Input placeholder="ej. api-core" />
            </Field>
            <Field label="Solicitante (requested_by)">
              <Input placeholder="correo@empresa.com" />
            </Field>
            <Field label="Proveedor">
              <Select>
                <option>AWS</option>
                <option>Azure</option>
                <option>GCP</option>
                <option>OnPremise</option>
              </Select>
            </Field>
            <Field label="Acción">
              <Select>
                <option>Crear</option>
                <option>Actualizar</option>
                <option>Detener</option>
                <option>Eliminar</option>
              </Select>
            </Field>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Field label="Tipo de instancia">
              <Select>
                <option>t3.medium</option>
                <option>t3.large</option>
              </Select>
            </Field>
            <Field label="Región">
              <Select>
                <option>us-east-1</option>
                <option>us-west-2</option>
              </Select>
            </Field>
            <Field label="VPC">
              <Select>
                <option>vpc-123456</option>
              </Select>
            </Field>
            <Field label="AMI">
              <Input placeholder="ami-0abc1234" />
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500">Crear VM</button>
            <button className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600">Guardar Cambios</button>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-slate-200 font-medium mb-4">Campos por proveedor (referencia rápida)</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-slate-300 mb-3">Azure</h4>
              <div className="space-y-3">
                <Field label="Tamaño"><Select><option>B2s</option></Select></Field>
                <Field label="Grupo de recursos"><Input placeholder="rg-prod"/></Field>
                <Field label="Imagen"><Select><option>Ubuntu 22.04</option></Select></Field>
                <Field label="VNet"><Select><option>vnet-app</option></Select></Field>
              </div>
            </div>
            <div>
              <h4 className="text-slate-300 mb-3">GCP</h4>
              <div className="space-y-3">
                <Field label="Tipo de máquina"><Select><option>e2-standard-4</option></Select></Field>
                <Field label="Zona"><Select><option>us-central1-a</option></Select></Field>
                <Field label="Disco base"><Select><option>50 GB SSD</option></Select></Field>
                <Field label="Proyecto"><Input placeholder="ml-prod-123"/></Field>
              </div>
            </div>
            <div>
              <h4 className="text-slate-300 mb-3">On-Premise</h4>
              <div className="grid grid-cols-2 gap-3">
                <Field label="CPU"><Input placeholder="8"/></Field>
                <Field label="RAM (GB)"><Input placeholder="32"/></Field>
                <Field label="Disco (GB)"><Input placeholder="200"/></Field>
                <Field label="NIC"><Select><option>eth0</option></Select></Field>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg text-slate-100 font-semibold mb-4">Logs / Estado</h3>
          <div className="space-y-3">
            <div className="rounded-lg px-3 py-2 bg-emerald-500/20 text-emerald-300">VM #vm-1025 iniciada correctamente.</div>
            <div className="rounded-lg px-3 py-2 bg-amber-500/20 text-amber-300">Creando VM "ml-worker-2" en GCP...</div>
            <div className="rounded-lg px-3 py-2 bg-rose-500/20 text-rose-300">Error: No se pudo detener vm #vm-1026.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearVM;
