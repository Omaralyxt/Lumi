import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import OffersPage from "./pages/OffersPage";
import FavoritesPage from "./pages/FavoritesPage";
import AccountPage from "./pages/AccountPage";
import BottomNavLumi from "./components/BottomNavLumi";
import SellerLogin from "./components/SellerLogin";
import SellerRegister from "./components/SellerRegister";
import SellerDashboard from "./components/SellerDashboard";
import CreateProduct from "./pages/CreateProduct";
import SellerProducts from "./pages/SellerProducts";
import BuyerLogin from "./components/BuyerLogin";
import BuyerRegister from "./components/BuyerRegister";
import ProductDetail from "./pages/ProductDetail";
import { CompareProvider } from "./context/CompareContext";
import CompareBar from "./components/CompareBar";
import ComparePage from "./pages/ComparePage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/Checkout";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Profile from "./pages/Profile";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import StorePage from "./pages/StorePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompareProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/store/:id" element={<StorePage />} />
              
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
            <BottomNavLumi />
            <CompareBar />
          </BrowserRouter>
        </CartProvider>
      </CompareProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;