import { UserPlus, PawPrint, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Crie sua conta",
    description:
      "Cadastre-se gratuitamente e acesse precos, agenda e disponibilidade.",
  },
  {
    icon: PawPrint,
    title: "Cadastre seu pet",
    description:
      "Adicione as informacoes do seu pet para um cuidado personalizado.",
  },
  {
    icon: CalendarCheck,
    title: "Agende o servico",
    description:
      "Escolha o dia, horario e tipo de servico. Pagamento seguro pelo app.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-section">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-muted-foreground">
            Em tres passos simples, seu pet recebe o melhor cuidado
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
