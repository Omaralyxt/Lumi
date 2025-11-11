"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import LoginPage from './pages/Login';
import AppLayout from './components/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import OrderHistoryPage from './pages/OrderHistoryPage'; // Importando a nova página

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
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