import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import OffersPage from "./pages/OffersPage";
import FavoritesPage from "./pages/FavoritesPage";
import AccountPage from "./pages/AccountPage";
import BuyerLogin from "./components/BuyerLogin";
import BuyerRegister from "./components/BuyerRegister";
import ProductDetail from "./pages/ProductDetail";
import SalesPage from "./pages/SalesPage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Profile from "./pages/Profile";
import StorePage from "./pages/StorePage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import { ThemeProvider } from "./context/ThemeProvider";
import AppLayout from "./components/AppLayout";
import { OrdersProvider } from "./context/OrdersContext";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import { ReviewsProvider } from "./context/ReviewsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import RootRedirect from "./components/RootRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="lumi-theme">
      <TooltipProvider>
        <FavoritesProvider>
          <CartProvider>
            <OrdersProvider>
              <ReviewsProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<RootRedirect />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/offers" element={<OffersPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      
                      {/* Rotas que exigem login ou redirecionam para login */}
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/orders" element={<OrderHistoryPage />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                      
                      {/* Rotas Públicas */}
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/store/:id" element={<StorePage />} />
                      <Route path="/category/:slug" element={<CategoryProductsPage />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/sales/:id" element={<SalesPage />} />
                      
                      {/* Rotas de Autenticação (Apenas Comprador) */}
                      <Route path="/login" element={<BuyerLogin />} />
                      <Route path="/register" element={<BuyerRegister />} />
                      
                      {/* Redirecionar rotas antigas de comprador para as novas rotas simplificadas */}
                      <Route path="/buyer/login" element={<Navigate to="/login" replace />} />
                      <Route path="/buyer/register" element={<Navigate to="/register" replace />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </BrowserRouter>
              </ReviewsProvider>
            </OrdersProvider>
          </CartProvider>
        </FavoritesProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;