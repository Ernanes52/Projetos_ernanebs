import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { ToastProvider } from './components/Toast';
import HomeScreen from './pages/HomeScreen';
import OperationalScreen from './pages/OperationalScreen';
import ClientsScreen from './pages/ClientsScreen';
import NewBudgetWizard from './pages/NewBudgetWizard';
import NewReceiptScreen from './pages/NewReceiptScreen';
import IssuedItemsScreen from './pages/IssuedItemsScreen';
import DashboardScreen from './pages/DashboardScreen';

export default function App() {
  return (
    <AppDataProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/operacional" element={<OperationalScreen />} />
              <Route path="/clientes" element={<ClientsScreen />} />
              <Route path="/orcamento/novo" element={<NewBudgetWizard />} />
              <Route path="/recibo/novo" element={<NewReceiptScreen />} />
              <Route path="/itens-emitidos" element={<IssuedItemsScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AppDataProvider>
  );
}
