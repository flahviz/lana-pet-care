import { Link } from "react-router-dom";
import { Dog, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-foreground text-background">
      <div className="container-section py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Dog className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Lana Pet Care</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Cuidado profissional e carinhoso para seu melhor amigo. 
              Passeios e visitas com toda a atenção que seu pet merece.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Navegação</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-background/70 hover:text-background transition-colors">
                Início
              </Link>
              <Link to="/avaliacoes" className="text-sm text-background/70 hover:text-background transition-colors">
                Avaliações
              </Link>
              <Link to="/sobre" className="text-sm text-background/70 hover:text-background transition-colors">
                Sobre
              </Link>
              <Link to="/ajuda" className="text-sm text-background/70 hover:text-background transition-colors">
                Ajuda
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Serviços</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-background/70">Dog Walker</span>
              <span className="text-sm text-background/70">Pet Sitter</span>
              <span className="text-sm text-background/70">Visitas</span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Contato</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:elianepetcare@gmail.com" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
                <Mail className="w-4 h-4" />
                elianepetcare@gmail.com
              </a>
              {user ? (
                <a href="https://wa.me/5548996639483" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
                  <Phone className="w-4 h-4" />
                  (48) 99663-9483
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm text-background/70">
                  <Phone className="w-4 h-4" />
                  <Link to="/cadastro" className="underline hover:text-background">Cadastre-se para ver</Link>
                </span>
              )}
              <span className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4" />
                Grande Florianópolis, SC
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © 2025 Lana Pet Care. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/politicas" className="text-sm text-background/60 hover:text-background transition-colors">
                Políticas
              </Link>
              <Link to="/termos" className="text-sm text-background/60 hover:text-background transition-colors">
                Termos de uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
