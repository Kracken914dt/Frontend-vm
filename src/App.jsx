import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CrearVM from './pages/CrearVM';
import Logs from './pages/Logs';
import Configuracion from './pages/Configuracion';
import './App.css'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crear-vm" element={<CrearVM />} />
        <Route path="/crear-vm/:id" element={<CrearVM />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
