import React from 'react';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import TicSaludClinicHistoryPage from './pages/tic-salud-clinic-history';
import TicSaludAccessHistoryPage from './pages/tic-salud-access-history';
import PolarisPage from './pages/polaris';
import StatementPage from './pages/statement';
import CustomPage from './pages/custom';
import ProviderPage from './pages/provider';
import AskForSharePage from './pages/ask-for-share';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <Navigate to="/provider" /> }/>
      <Route path="polaris" element={<PolarisPage />}/>
      <Route path="tic-salud">
        <Route index element={<TicSaludClinicHistoryPage />}/>
        <Route path="historial" element={<TicSaludAccessHistoryPage />}/>
      </Route>
      <Route path="statement" element={<StatementPage />}/>
      <Route path="custom" element={<CustomPage />}/>
      <Route path="provider" element={<ProviderPage />}/>
      <Route path="ask-for-share" element={<AskForSharePage />}/>

    </Routes>
  );
}

export default App;
