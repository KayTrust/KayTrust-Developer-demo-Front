import React from 'react';
import './App.css';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import TicSaludClinicHistoryPage from './pages/tic-salud-clinic-history';
import TicSaludAccessHistoryPage from './pages/tic-salud-access-history';
import PolarisPage from './pages/polaris';
import StatementPage from './pages/statement';
import CustomPage from './pages/custom';
import ProviderPage from './pages/provider';
import AskForSharePage from './pages/ask-for-share';
import OpenDoorPage from './pages/open-door';

function App() {
  return (
    /**
     * provider: Te genera una credencial customizada en claims y types y luego la manda al Hub para que le aparezca al usuario en su KW.
     * custom: Te genera una credencial customizada en claims y te muestra el QR para que te la descargues.
     * ask-for-share: Te pide compartir un claim y lo verifica y te responde al respecto.
     * polaris: Te genera credencial de medico
     * tic-salud: Te pide credencial de médico para ver historial
     * tic-salud/historial: Deberias de ver el historial de médicos que vieron tu ficha pero está saliendo en blanco.
     */
    <Routes>
      <Route path="/" element={ <Navigate to="/provider" /> }/>
      <Route path="provider" element={<ProviderPage />}/>
      <Route path="custom" element={<CustomPage />}/>
      <Route path="statement" element={<StatementPage />}/>
      <Route path="ask-for-share" element={<AskForSharePage />}/>
      <Route path="open-door" element={<OpenDoorPage />}/>
      <Route path="polaris" element={<PolarisPage />}/>
      <Route path="tic-salud">
        <Route index element={<TicSaludClinicHistoryPage />}/>
        <Route path="historial" element={<TicSaludAccessHistoryPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
