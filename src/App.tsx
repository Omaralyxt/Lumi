"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home'; // Corrigido de Index para Home
import LoginPage from './pages/Login';
import AppLayout from './components/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import OrderHistoryPage from './pages/OrderHistoryPage'; // Componente de Histórico de Pedidos
import RegisterPage from './pages/Register';
import { QueryProvider } from './context/QueryProvider'; // Importando QueryProvider
import RootRedirect from './components/RootRedirect';
import CategoryProductsPage from './pages/CategoryProductsPage';
import SalesPage from './pages/SalesPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import OffersPage from './pages/OffersPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/Profile';
import AddressesPage from './pages/AddressesPage';
import PaymentsPage from './pages/PaymentsPage';
import CouponsPage from './pages/CouponsPage';
import SettingsPage from './pages/SettingsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CategoriesPage from './pages/CategoriesPage';
import NotFound from './pages/NotFound';
import CreateProduct from './components/CreateProduct';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import CartPage from './pages/CartPage';


function App() {
  return (
    <Router>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <AppLayout>
                <Routes>
                  {/* Rotas Principais */}
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/offers" element={<OffersPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  
                  {/* Rotas de Produto/Busca */}
                  <Route path="/category/:slug" element={<CategoryProductsPage />} />
                  <Route path="/sales/:id" element={<SalesPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  {/* Rotas de Carrinho/Checkout */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  
                  {/* Rotas de Conta */}
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/addresses" element={<AddressesPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/coupons" element={<CouponsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/order-history" element={<OrderHistoryPage />} /> {/* Rota adicionada/corrigida */}
                  
                  {/* Rotas de Autenticação */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Rotas de Vendedor/Admin (Exemplo) */}
                  <Route path="/seller/dashboard" element={<SalesDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/seller/product/new" element={<CreateProduct />} />
                  
                  {/* Rota 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </Router>
  );
}

export default App;