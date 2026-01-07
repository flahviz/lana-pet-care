import { Heart, Shield, Camera, Clock, Award, MessageCircle } from "lucide-react";

const differentials = [
  {
    icon: Heart,
    title: "Cuidado personalizado",
    description: "Cada pet recebe atenção individual de acordo com suas necessidades e temperamento.",
  },
  {
    icon: Shield,
    title: "Segurança garantida",
    description: "Pagamento seguro, rotas monitoradas e comunicação constante com você.",
  },
  {
    icon: Camera,
    title: "Fotos e atualizações",
    description: "Receba fotos e relatórios do seu pet durante e após cada serviço.",
  },
  {
    icon: Clock,
    title: "Horários flexíveis",
    description: "Agenda adaptada à sua rotina, com opções de manhã, tarde ou noite.",
  },
  {
    icon: Award,
    title: "Experiência comprovada",
    description: "Mais de 5 anos cuidando de pets com carinho e profissionalismo.",
  },
  {
    icon: MessageCircle,
    title: "Suporte direto",
    description: "Comunicação fácil e rápida para tirar dúvidas ou fazer ajustes.",
  },
];

const DifferentialsSection = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container-section">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Por que escolher nosso serviço
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Diferenciais que fazem toda a diferença no cuidado do seu pet
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
