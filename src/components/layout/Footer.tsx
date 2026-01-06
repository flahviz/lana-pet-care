import { Link } from "react-router-dom";
import { Dog, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
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
              <span className="text-xl font-bold">PetCare</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Cuidado profissional e carinhoso para seu melhor amigo. 
              Passeios e hospedagem com toda a atencao que seu pet merece.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Navegacao</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-background/70 hover:text-background transition-colors">
                Inicio
              </Link>
              <Link to="/avaliacoes" className="text-sm text-background/70 hover:text-background transition-colors">
                Avaliacoes
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
            <h4 className="font-semibold text-base">Servicos</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-background/70">Dog Walker</span>
              <span className="text-sm text-background/70">Pet Sitter</span>
              <span className="text-sm text-background/70">Visitas</span>
              <span className="text-sm text-background/70">Pernoite</span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Contato</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:contato@petcare.com" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
                <Mail className="w-4 h-4" />
                contato@petcare.com
              </a>
              <a href="tel:+5511999999999" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
                <Phone className="w-4 h-4" />
                (11) 99999-9999
              </a>
              <span className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4" />
                Sao Paulo, SP
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              2024 PetCare. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/politicas" className="text-sm text-background/60 hover:text-background transition-colors">
                Politicas
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
