import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout"; // Importando AppLayout

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota de Layout Principal */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Index />} /> {/* Rota padrão (/) */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            
            {/* Rotas que não usam o layout (se houver) podem ser adicionadas fora do AppLayout, mas por enquanto, todas usam. */}
          </Route>
          
          {/* Rota 404 deve estar fora do AppLayout para não mostrar o header/footer em caso de erro */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;