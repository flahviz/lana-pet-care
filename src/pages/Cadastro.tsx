import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from "lucide-react";

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular cadastro - sera implementado com backend
    setTimeout(() => setIsLoading(false), 1000);
  };

  const benefits = [
    "Veja precos e disponibilidade",
    "Agende servicos em poucos cliques",
    "Cadastre seus pets uma unica vez",
    "Pague com seguranca pelo app",
    "Receba fotos e atualizacoes",
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      <main className="pt-20 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* Benefits */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Crie sua conta gratuita
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tenha acesso a todos os recursos para cuidar do seu pet
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="card-elevated p-8">
            <div className="text-center mb-8 md:hidden">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Criar conta
              </h1>
              <p className="text-muted-foreground">
                Cadastre-se para agendar servicos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="input-field pl-11"
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
                    placeholder="Crie uma senha forte"
                    className="input-field pl-11 pr-11"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimo de 8 caracteres</p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5" 
                  required
                />
                <span className="text-sm text-muted-foreground">
                  Li e aceito os{" "}
                  <Link to="/termos" className="text-primary hover:underline">termos de uso</Link>
                  {" "}e{" "}
                  <Link to="/politicas" className="text-primary hover:underline">politica de privacidade</Link>
                </span>
              </label>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar minha conta"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Ja tem uma conta?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Entrar
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

export default Cadastro;
