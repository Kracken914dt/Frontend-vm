import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

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

// Input with datalist suggestions (acts like a select with free typing)
const ComboInput = ({ listId, options = [], ...props }) => (
  <>
    <input
      {...props}
      list={listId}
      className={`w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 ${props.className || ''}`}
    />
    <datalist id={listId}>
      {options.map((opt) => (
        <option key={opt} value={opt} />
      ))}
    </datalist>
  </>
);

const CrearVM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({
    nombre: '',
    requested_by: '',
    proveedor: 'AWS',
    tipo_instancia: 't3.medium',
    region: 'us-east-1',
    vpc: 'vpc-123456',
    ami: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loadingVM, setLoadingVM] = useState(false);
  const [params, setParams] = useState({});

  // Basic provider-specific validation
  const validate = () => {
    if (!form.nombre?.trim()) return { ok: false, message: 'Ingresa un nombre para la VM' };
    if (!form.requested_by?.trim()) return { ok: false, message: 'Ingresa el solicitante (requested_by)' };
    const p = (form.proveedor || '').toLowerCase();
    const required = {
      aws: ['instance_type', 'region', 'vpc', 'ami'],
      azure: ['size', 'resource_group', 'image', 'vnet'],
      gcp: ['machine_type', 'zone', 'base_disk', 'project'],
      onpremise: ['cpu', 'ram_gb', 'disk_gb', 'nic'],
      oracle: ['compute_shape', 'compartment_id', 'availability_domain', 'subnet_id', 'image_id'],
    };
    const need = required[p] || [];
    for (const k of need) {
      if (params[k] === undefined || params[k] === null || `${params[k]}`.trim() === '') {
        return { ok: false, message: `Falta el parámetro requerido: ${k}` };
      }
    }
    return { ok: true };
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Defaults per provider to help the user
  const defaultParamsFor = (provider) => {
    const p = (provider || '').toLowerCase();
    if (p === 'aws') return { instance_type: 't2.micro', region: 'us-east-1', vpc: 'vpc-123', ami: 'ami-abc' };
    if (p === 'azure') return { size: 'Standard_B1s', resource_group: 'rg1', image: 'UbuntuLTS', vnet: 'vnet-01' };
    if (p === 'gcp') return { machine_type: 'e2-micro', zone: 'us-central1-a', base_disk: 'pd-standard', project: 'demo-proj' };
    if (p === 'onpremise') return { cpu: 4, ram_gb: 8, disk_gb: 50, nic: 'eth0' };
    if (p === 'oracle') return { compute_shape: 'VM.Standard2.1', compartment_id: '', availability_domain: 'AD-1', subnet_id: '', image_id: '' };
    return {};
  };

  // Suggestion lists per provider
  const awsOpts = {
    instance_type: ['t2.nano','t2.micro','t3.micro','t3.small','t3.medium','m5.large','c5.large','r5.large'],
    region: ['us-east-1','us-east-2','us-west-1','us-west-2','eu-west-1','eu-central-1','ap-south-1','sa-east-1'],
    vpc: ['vpc-123','vpc-456','vpc-789'],
    ami: ['ami-abc123','ami-0abcdef','ami-123456']
  };
  const azureOpts = {
    size: ['Standard_B1s','Standard_B2s','Standard_D2s_v5','Standard_F2s_v2','Standard_DS1_v2'],
    image: ['UbuntuLTS','Ubuntu2204','Windows2019','Windows2022','Debian11'],
    resource_group: ['rg1','rg-app','rg-prod'],
    vnet: ['vnet-01','vnet-app','vnet-shared']
  };
  const gcpOpts = {
    machine_type: ['e2-micro','e2-small','e2-medium','n1-standard-1','n2-standard-2'],
    zone: ['us-central1-a','us-central1-b','us-central1-c','us-east1-b','us-west1-a'],
    base_disk: ['pd-standard','pd-ssd','hyperdisk-balanced'],
    project: ['demo-proj','ml-prod-123','sandbox-001']
  };
  const onpremiseOpts = {
    nic: ['eth0','eth1','ens160','ens192']
  };
  const oracleOpts = {
    compute_shape: ['VM.Standard2.1','VM.Standard.E3.Flex','VM.Standard.A1.Flex'],
    availability_domain: ['AD-1','AD-2','AD-3'],
    image_id: ['ocid1.image...a','ocid1.image...b']
  };

  const onCreate = async () => {
    setMsg({ type: '', text: '' });
    const v = validate();
    if (!v.ok) { setMsg({ type: 'error', text: v.message }); return; }
    setSubmitting(true);
    try {
      const provider = (form.proveedor || '').toLowerCase();
      const payloadParams = params;
      const payload = {
        provider,
        name: form.nombre,
        params: payloadParams,
        requested_by: form.requested_by,
      };
      const res = await api.createVM(payload);
      setMsg({ type: 'success', text: `VM creada: ${res?.id ?? res?.name ?? 'éxito'}` });
    } catch (e) {
      setMsg({ type: 'error', text: e?.message || 'Error al crear la VM' });
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdate = async () => {
    setMsg({ type: '', text: '' });
    const v = validate();
    if (!v.ok) { setMsg({ type: 'error', text: v.message }); return; }
    setSubmitting(true);
    try {
      const provider = (form.proveedor || '').toLowerCase();
      const payload = {
        provider,
        name: form.nombre,
        params,
        requested_by: form.requested_by,
      };
      const res = await api.updateVM(id, payload);
      setMsg({ type: 'success', text: `VM actualizada: ${res?.id ?? id}` });
      navigate('/');
    } catch (e) {
      setMsg({ type: 'error', text: e?.message || 'Error al actualizar la VM' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadVM = async () => {
      if (!isEdit) return;
      setLoadingVM(true);
      setMsg({ type: '', text: '' });
      try {
        const resp = await api.getVM(id);
        // Support: object, envelope, or array
        let vm = resp;
        if (resp && typeof resp === 'object' && !Array.isArray(resp) && resp.vm) vm = resp.vm;
        if (Array.isArray(resp)) {
          vm = resp.find((it) => {
            const cand = it.id ?? it._id ?? it.uuid ?? it.name;
            return String(cand) === String(id);
          }) || resp[0];
        }

        const loadedParamsRaw = vm?.params || vm?.specs || vm?.configuration || {};
        const rawProv = vm?.proveedor ?? vm?.provider ?? vm?.cloud ?? 'AWS';
        const pLower = String(rawProv).toLowerCase();
        const provUI = pLower === 'aws' ? 'AWS'
          : pLower === 'azure' ? 'Azure'
          : pLower === 'gcp' ? 'GCP'
          : pLower === 'onpremise' ? 'OnPremise'
          : pLower === 'oracle' ? 'Oracle'
          : 'AWS';
        // Merge defaults to ensure all keys exist for rendering
        const mergedParams = { ...defaultParamsFor(provUI), ...loadedParamsRaw };
        setForm({
          nombre: vm?.nombre ?? vm?.name ?? vm?.vm_name ?? '',
          requested_by: vm?.requested_by ?? vm?.owner ?? '',
          proveedor: provUI,
          tipo_instancia: mergedParams.instance_type ?? mergedParams.size ?? mergedParams.machine_type ?? 't3.medium',
          region: mergedParams.region ?? mergedParams.zone ?? mergedParams.location ?? 'us-east-1',
          vpc: mergedParams.vpc ?? mergedParams.vnet ?? mergedParams.network ?? mergedParams.project ?? 'vpc-123456',
          ami: mergedParams.ami ?? mergedParams.image ?? mergedParams.base_disk ?? '',
        });
        setParams(mergedParams);
      } catch (e) {
        setMsg({ type: 'error', text: e?.message || 'No se pudo cargar la VM' });
      } finally {
        setLoadingVM(false);
      }
    };
    loadVM();
  }, [id, isEdit]);

  // When provider changes, set default params for that provider
  useEffect(() => {
    const p = (form.proveedor || '').toLowerCase();
    if (!isEdit) {
      setParams(defaultParamsFor(p));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.proveedor]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Toast */}
      {msg.type === 'success' && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border bg-emerald-500/20 text-emerald-300 border-emerald-600/30 shadow">
          {msg.text}
        </div>
      )}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">{isEdit ? `Editar VM (${id})` : 'Crear VM'}</h2>
          {loadingVM && (
            <div className="mb-3 text-sm text-slate-300">Cargando datos de la VM...</div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nombre de la VM">
              <Input name="nombre" value={form.nombre} onChange={onChange} placeholder="ej. api-core" />
            </Field>
            <Field label="Solicitante (requested_by)">
              <Input name="requested_by" value={form.requested_by} onChange={onChange} placeholder="correo@empresa.com" />
            </Field>
            <Field label="Proveedor">
              <Select name="proveedor" value={form.proveedor} onChange={onChange}>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="GCP">GCP</option>
                <option value="OnPremise">OnPremise</option>
                <option value="Oracle">Oracle</option>
              </Select>
            </Field>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {(form.proveedor === 'AWS') && (
              <>
                <Field label="Instance Type">
                  <ComboInput listId="aws-instance-type" options={awsOpts.instance_type} value={params.instance_type || ''} onChange={(e) => setParam('instance_type', e.target.value)} placeholder="t2.micro" />
                </Field>
                <Field label="Region">
                  <ComboInput listId="aws-region" options={awsOpts.region} value={params.region || ''} onChange={(e) => setParam('region', e.target.value)} placeholder="us-east-1" />
                </Field>
                <Field label="VPC">
                  <ComboInput listId="aws-vpc" options={awsOpts.vpc} value={params.vpc || ''} onChange={(e) => setParam('vpc', e.target.value)} placeholder="vpc-123" />
                </Field>
                <Field label="AMI">
                  <ComboInput listId="aws-ami" options={awsOpts.ami} value={params.ami || ''} onChange={(e) => setParam('ami', e.target.value)} placeholder="ami-abc" />
                </Field>
              </>
            )}
            {(form.proveedor === 'Azure') && (
              <>
                <Field label="Size">
                  <ComboInput listId="az-size" options={azureOpts.size} value={params.size || ''} onChange={(e) => setParam('size', e.target.value)} placeholder="Standard_B1s" />
                </Field>
                <Field label="Resource Group">
                  <ComboInput listId="az-rg" options={azureOpts.resource_group} value={params.resource_group || ''} onChange={(e) => setParam('resource_group', e.target.value)} placeholder="rg1" />
                </Field>
                <Field label="Image">
                  <ComboInput listId="az-image" options={azureOpts.image} value={params.image || ''} onChange={(e) => setParam('image', e.target.value)} placeholder="UbuntuLTS" />
                </Field>
                <Field label="VNet">
                  <ComboInput listId="az-vnet" options={azureOpts.vnet} value={params.vnet || ''} onChange={(e) => setParam('vnet', e.target.value)} placeholder="vnet-01" />
                </Field>
              </>
            )}
            {(form.proveedor === 'GCP') && (
              <>
                <Field label="Machine Type">
                  <ComboInput listId="gcp-machine" options={gcpOpts.machine_type} value={params.machine_type || ''} onChange={(e) => setParam('machine_type', e.target.value)} placeholder="e2-micro" />
                </Field>
                <Field label="Zone">
                  <ComboInput listId="gcp-zone" options={gcpOpts.zone} value={params.zone || ''} onChange={(e) => setParam('zone', e.target.value)} placeholder="us-central1-a" />
                </Field>
                <Field label="Base Disk">
                  <ComboInput listId="gcp-basedisk" options={gcpOpts.base_disk} value={params.base_disk || ''} onChange={(e) => setParam('base_disk', e.target.value)} placeholder="pd-standard" />
                </Field>
                <Field label="Project">
                  <ComboInput listId="gcp-project" options={gcpOpts.project} value={params.project || ''} onChange={(e) => setParam('project', e.target.value)} placeholder="demo-proj" />
                </Field>
              </>
            )}
            {(form.proveedor === 'OnPremise') && (
              <>
                <Field label="CPU">
                  <Input type="number" value={params.cpu ?? ''} onChange={(e) => setParam('cpu', Number(e.target.value))} placeholder="4" />
                </Field>
                <Field label="RAM (GB)">
                  <Input type="number" value={params.ram_gb ?? ''} onChange={(e) => setParam('ram_gb', Number(e.target.value))} placeholder="8" />
                </Field>
                <Field label="Disco (GB)">
                  <Input type="number" value={params.disk_gb ?? ''} onChange={(e) => setParam('disk_gb', Number(e.target.value))} placeholder="50" />
                </Field>
                <Field label="NIC">
                  <ComboInput listId="onp-nic" options={onpremiseOpts.nic} value={params.nic || ''} onChange={(e) => setParam('nic', e.target.value)} placeholder="eth0" />
                </Field>
              </>
            )}
            {(form.proveedor === 'Oracle') && (
              <>
                <Field label="Compute Shape">
                  <ComboInput listId="orc-shape" options={oracleOpts.compute_shape} value={params.compute_shape || ''} onChange={(e) => setParam('compute_shape', e.target.value)} placeholder="VM.Standard2.1" />
                </Field>
                <Field label="Compartment ID">
                  <ComboInput listId="orc-comp" options={[]} value={params.compartment_id || ''} onChange={(e) => setParam('compartment_id', e.target.value)} placeholder="ocid1.compartment..." />
                </Field>
                <Field label="Availability Domain">
                  <ComboInput listId="orc-ad" options={oracleOpts.availability_domain} value={params.availability_domain || ''} onChange={(e) => setParam('availability_domain', e.target.value)} placeholder="AD-1" />
                </Field>
                <Field label="Subnet ID">
                  <ComboInput listId="orc-subnet" options={[]} value={params.subnet_id || ''} onChange={(e) => setParam('subnet_id', e.target.value)} placeholder="ocid1.subnet..." />
                </Field>
                <Field label="Image ID">
                  <ComboInput listId="orc-image" options={oracleOpts.image_id} value={params.image_id || ''} onChange={(e) => setParam('image_id', e.target.value)} placeholder="ocid1.image..." />
                </Field>
              </>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            {!isEdit && (
              <button onClick={onCreate} disabled={submitting} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Creando...' : 'Crear VM'}
              </button>
            )}
            {isEdit && (
              <button onClick={onUpdate} disabled={submitting} className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            )}
            {isEdit && (
              <button onClick={() => navigate('/')} disabled={submitting} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-60 disabled:cursor-not-allowed">
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-slate-200 font-medium mb-4">Campos por proveedor (referencia rápida)</h3>
          {msg.text && (
            <div className={`mb-4 rounded-lg px-3 py-2 border ${msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-600/30' : 'bg-rose-500/20 text-rose-300 border-rose-600/30'}`}>
              {msg.text}
            </div>
          )}
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
