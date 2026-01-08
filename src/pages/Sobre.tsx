import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Heart, MapPin, Clock, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import petSitterImage from "@/assets/pet-sitter-home.jpg";

const Sobre = () => {
  const stats = [
    { value: "10+", label: "Anos de experiência" },
    { value: "5 ★", label: "Clientes satisfeitos" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Amor pelos animais",
      description: "Cada pet é tratado com o carinho e a atenção que merece, como se fosse da família.",
    },
    {
      icon: Shield,
      title: "Segurança em primeiro lugar",
      description: "Rotas seguras, comunicação constante e cuidado redobrado em todas as atividades.",
    },
    {
      icon: Clock,
      title: "Pontualidade",
      description: "Respeito ao seu tempo e à rotina do seu pet, sempre no horário combinado.",
    },
    {
      icon: Award,
      title: "Profissionalismo",
      description: "Serviço dedicado e transparente, com relatórios e fotos de cada atendimento.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding bg-secondary">
          <div className="container-section">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Cuidando de pets com amor e dedicação
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Olá! Sou a Lana, apaixonada por animais desde sempre. Há mais de 10 anos, 
                  transformei essa paixão em profissão, oferecendo serviços de dog walker 
                  e pet sitter para tutores que buscam cuidado de qualidade para seus pets.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Cada pet que atendo recebe atenção individualizada, respeitando suas 
                  necessidades e temperamento. Meu objetivo é proporcionar bem-estar 
                  ao seu melhor amigo e tranquilidade para você.
                </p>
                <Button variant="default" size="lg" asChild>
                  <Link to="/cadastro">Conhecer serviços</Link>
                </Button>
              </div>
              <div className="relative">
                <img
                  src={petSitterImage}
                  alt="Cuidando de pets em casa"
                  className="rounded-2xl shadow-elevated w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-primary">
          <div className="container-section">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-section">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meus valores
              </h2>
              <p className="text-lg text-muted-foreground">
                Princípios que guiam cada atendimento
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="card-elevated p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="section-padding bg-secondary">
          <div className="container-section">
            <div className="max-w-3xl mx-auto text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Área de atendimento
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Atendo a Grande Florianópolis, incluindo:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Florianópolis", "São José", "Palhoça", "Biguaçu", "Santo Amaro da Imperatriz"].map((bairro) => (
                  <span key={bairro} className="px-4 py-2 bg-background rounded-full text-foreground font-medium">
                    {bairro}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mt-6">
                Não encontrou seu bairro? Entre em contato para verificar disponibilidade.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-accent">
          <div className="container-section text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              Vamos cuidar do seu pet juntos?
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-xl mx-auto">
              Crie sua conta gratuita e agende o primeiro serviço. 
              Seu pet merece o melhor cuidado!
            </p>
            <Button 
              size="xl" 
              className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
              asChild
            >
              <Link to="/cadastro">Criar conta grátis</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
