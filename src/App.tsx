import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Avaliacoes from "./pages/Avaliacoes";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Sobre from "./pages/Sobre";
import Ajuda from "./pages/Ajuda";
import Dashboard from "./pages/Dashboard";
import MeusPets from "./pages/MeusPets";
import Agenda from "./pages/Agenda";
import NovoPedido from "./pages/NovoPedido";
import MeusPedidos from "./pages/MeusPedidos";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminAgenda from "./pages/admin/AdminAgenda";
import AdminPrecos from "./pages/admin/AdminPrecos";
import AdminAvaliacoes from "./pages/admin/AdminAvaliacoes";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/ajuda" element={<Ajuda />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meus-pets" element={<MeusPets />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/novo-pedido" element={<NovoPedido />} />
            <Route path="/meus-pedidos" element={<MeusPedidos />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="agenda" element={<AdminAgenda />} />
              <Route path="precos" element={<AdminPrecos />} />
              <Route path="avaliacoes" element={<AdminAvaliacoes />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
