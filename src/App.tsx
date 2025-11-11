"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home'; // Corrigido de Index para Home
import LoginPage from './pages/Login';
import AppLayout from './components/AppLayout';
import { AuthProvider } from './context/AuthContext'; // Agora existe
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import OrderHistoryPage from './pages/OrderHistoryPage';
import RegisterPage from './pages/Register'; // Adicionando a rota de registro

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Adicione outras rotas aqui */}
              </Routes>
            </AppLayout>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;