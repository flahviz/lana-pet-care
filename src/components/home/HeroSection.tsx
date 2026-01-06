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
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-medium text-background">
              Nota 4.9 com mais de 200 avaliacoes
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
            Cuidado profissional e carinhoso para seu pet
          </h1>

          <p className="text-lg md:text-xl text-background/90 mb-8 leading-relaxed">
            Passeios diarios e hospedagem com toda a atencao que seu melhor amigo merece. 
            Servico personalizado e seguro na regiao de Sao Paulo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero-accent" size="xl" asChild>
              <Link to="/cadastro">Comecar agora</Link>
            </Button>
            <Button variant="hero-outline" size="xl" className="border-background text-background hover:bg-background hover:text-foreground" asChild>
              <Link to="/avaliacoes">Ver avaliacoes</Link>
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
              <span className="text-sm font-medium">Agenda flexivel</span>
            </div>
            <div className="flex items-center gap-2 text-background/80">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">5 anos de experiencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
