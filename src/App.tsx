import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Avaliacoes = lazy(() => import("./pages/Avaliacoes"));
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Ajuda = lazy(() => import("./pages/Ajuda"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MeusPets = lazy(() => import("./pages/MeusPets"));
const Agenda = lazy(() => import("./pages/Agenda"));
const NovoPedido = lazy(() => import("./pages/NovoPedido"));
const MeusPedidos = lazy(() => import("./pages/MeusPedidos"));
const RecuperarSenha = lazy(() => import("./pages/RecuperarSenha"));
const RedefinirSenha = lazy(() => import("./pages/RedefinirSenha"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPedidos = lazy(() => import("./pages/admin/AdminPedidos"));
const AdminAgenda = lazy(() => import("./pages/admin/AdminAgenda"));
const AdminPrecos = lazy(() => import("./pages/admin/AdminPrecos"));
const AdminAvaliacoes = lazy(() => import("./pages/admin/AdminAvaliacoes"));
const AdminConfiguracoes = lazy(
  () => import("./pages/admin/AdminConfiguracoes"),
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-muted text-sm text-muted-foreground">
                Carregando...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/avaliacoes" element={<Avaliacoes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/ajuda" element={<Ajuda />} />
              <Route path="/recuperar-senha" element={<RecuperarSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
