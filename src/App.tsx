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
import UserTypeSelection from "./components/UserTypeSelection";
import SellerLogin from "./components/SellerLogin";
import SellerRegister from "./components/SellerRegister";
import SellerDashboard from "./components/SellerDashboard";
import CreateProduct from "./pages/CreateProduct";
import SellerProducts from "./pages/SellerProducts";
import BuyerLogin from "./components/BuyerLogin";
import BuyerRegister from "./components/BuyerRegister";
import ProductDetail from "./pages/ProductDetail";
import { CompareProvider } from "./context/CompareContext";
import ComparePage from "./pages/ComparePage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/Checkout";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Profile from "./pages/Profile";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import StorePage from "./pages/StorePage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import { ThemeProvider } from "./context/ThemeProvider";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="lumi-theme">
      <TooltipProvider>
        <CompareProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={
                    localStorage.getItem("lumi_token") ? <Navigate to="/home" /> : <UserTypeSelection />
                  } />
                  <Route path="/home" element={<Home />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/offers" element={<OffersPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/user-type" element={<UserTypeSelection />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/store/:id" element={<StorePage />} />
                  <Route path="/category/:slug" element={<CategoryProductsPage />} />
                  
                  {/* Rotas de Vendedor */}
                  <Route path="/seller/login" element={<SellerLogin />} />
                  <Route path="/seller/register" element={<SellerRegister />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/create-product" element={<CreateProduct />} />
                  <Route path="/seller/products" element={<SellerProducts />} />
                  <Route path="/seller/orders" element={<SellerOrdersPage />} />
                  
                  {/* Rotas de Comprador */}
                  <Route path="/buyer/login" element={<BuyerLogin />} />
                  <Route path="/buyer/register" element={<BuyerRegister />} />
                  
                  {/* Rota de Produto Detalhado */}
                  <Route path="/product/:id" element={<ProductDetail />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </CartProvider>
        </CompareProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;