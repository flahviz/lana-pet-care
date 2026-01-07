import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import dogWalkerImage from "@/assets/dog-walker-service.jpg";
import petSitterImage from "@/assets/pet-sitter-home.jpg";

const services = [
  {
    id: "dog-walker",
    title: "Dog Walker",
    description:
      "Passeios diários com horários flexíveis. Seu cão terá exercício, socialização e muito carinho durante o passeio.",
    features: ["Passeios de 30 ou 60 minutos", "Fotos e relatório do passeio", "Horários personalizados"],
    image: dogWalkerImage,
  },
  {
    id: "pet-sitter",
    title: "Pet Sitter",
    description:
      "Visitas na sua casa para cuidar do seu pet enquanto você viaja ou trabalha. Carinho e atenção garantidos.",
    features: ["Visitas de 1h ou 2h", "Alimentação e medicação", "Fotos e atualizações"],
    image: petSitterImage,
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-section">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Serviços especializados
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha o tipo de cuidado ideal para as necessidades do seu pet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="card-interactive overflow-hidden group"
            >
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="default" className="w-full" asChild>
                  <Link to="/cadastro">
                    Solicitar serviço
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
