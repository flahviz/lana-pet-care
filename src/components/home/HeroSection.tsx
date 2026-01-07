import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-dog-walking.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Passeio com cachorro no parque"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content */}
      <div className="container-section relative z-10 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
            </div>
            <span className="text-sm font-medium text-background">
              Clientes satisfeitos
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
            Cuidado profissional e carinhoso para seu pet
          </h1>

          <p className="text-lg md:text-xl text-background/90 mb-8 leading-relaxed">
            Passeios diários e visitas com toda a atenção que seu melhor amigo merece. 
            Serviço personalizado e seguro na Grande Florianópolis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero-accent" size="xl" asChild>
              <Link to="/cadastro">Começar agora</Link>
            </Button>
            <Button variant="hero-outline" size="xl" className="border-background text-background hover:bg-background hover:text-foreground" asChild>
              <Link to="/avaliacoes">Ver avaliações</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-background/80">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2 text-background/80">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Agenda flexível</span>
            </div>
            <div className="flex items-center gap-2 text-background/80">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">+10 anos de experiência</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
