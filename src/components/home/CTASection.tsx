import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-section">
        <div className="relative overflow-hidden rounded-3xl bg-accent p-8 md:p-12 lg:p-16 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent-foreground/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent-foreground/10 rounded-full translate-x-1/4 translate-y-1/4" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground mb-4">
              Pronto para agendar?
            </h2>
            <p className="text-lg md:text-xl text-accent-foreground/90 mb-8">
              Crie sua conta gratis e garanta o melhor cuidado para seu pet
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="xl" 
                className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 w-full sm:w-auto"
                asChild
              >
                <Link to="/cadastro">
                  Criar conta gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-2 border-accent-foreground bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent w-full sm:w-auto"
                asChild
              >
                <Link to="/login">Ja tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
