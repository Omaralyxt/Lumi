import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SellerDashboard from "./pages/SellerDashboard";
import SellerLogin from "./components/SellerLogin";
import SellerRegister from "./components/SellerRegister";
import CreateProduct from "./pages/CreateProduct";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="seller-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              localStorage.getItem("seller_token") ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } />
            <Route path="/login" element={<SellerLogin />} />
            <Route path="/register" element={<SellerRegister />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/products" element={<SellerProducts />} />
            <Route path="/orders" element={<SellerOrders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;