import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import OffersPage from "./pages/OffersPage";
import FavoritesPage from "./pages/FavoritesPage";
import AccountPage from "./pages/AccountPage";
import BuyerLogin from "./components/BuyerLogin";
import BuyerRegister from "./components/BuyerRegister";
import SalesPage from "./pages/SalesPage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Profile from "./pages/Profile";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from "./context/ThemeProvider";
import AppLayout from "./components/AppLayout";
import { OrdersProvider } from "./context/OrdersContext";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import RootRedirect from "./components/RootRedirect";
import TrackOrderPage from "./pages/TrackOrderPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentsPage from "./pages/PaymentsPage";
import CouponsPage from "./pages/CouponsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="lumi-theme">
        <TooltipProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrdersProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<RootRedirect />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/offers" element={<OffersPage />} />
                      
                      {/* Rotas que exigem login ou redirecionam para login */}
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/orders" element={<OrderHistoryPage />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/addresses" element={<AddressesPage />} />
                      <Route path="/payments" element={<PaymentsPage />} />
                      <Route path="/coupons" element={<CouponsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                      
                      {/* Rotas Públicas */}
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/category/:slug" element={<CategoryProductsPage />} />
                      
                      {/* Redireciona a rota antiga para a nova rota de vendas */}
                      <Route path="/product/:id" element={<Navigate to="/sales/:id" replace />} />
                      <Route path="/sales/:id" element={<SalesPage />} />
                      <Route path="/track-order" element={<TrackOrderPage />} />
                      
                      {/* Rotas de Autenticação (Apenas Comprador) */}
                      <Route path="/login" element={<BuyerLogin />} />
                      <Route path="/register" element={<BuyerRegister />} />
                      
                      {/* Redirecionar rotas antigas de comprador para as novas rotas simplificadas */}
                      <Route path="/buyer/login" element={<Navigate to="/login" replace />} />
                      <Route path="/buyer/register" element={<Navigate to="/register" replace />} />
                      
                      {/* Rotas de Loja (Redirecionadas ou Removidas) */}
                      <Route path="/stores" element={<Navigate to="/home" replace />} />
                      <Route path="/store/:id" element={<Navigate to="/home" replace />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </BrowserRouter>
              </OrdersProvider>
            </CartProvider>
          </FavoritesProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;