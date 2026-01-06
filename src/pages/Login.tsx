import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Por favor, confirme seu email antes de entrar");
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
      setIsLoading(false);
      return;
    }

    toast.success("Login realizado com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card-elevated p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-muted-foreground">
                Entre na sua conta para agendar servicos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="input-field pl-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="input-field pl-11 pr-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Lembrar de mim</span>
                </label>
                <Link to="/recuperar-senha" className="text-sm font-medium text-primary hover:underline">
                  Esqueci a senha
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Nao tem uma conta?{" "}
                <Link to="/cadastro" className="font-medium text-primary hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
