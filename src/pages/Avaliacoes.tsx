import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const allReviews = [
  {
    id: 1,
    name: "Ana P.",
    rating: 5,
    service: "Dog Walker",
    date: "15 de dezembro, 2024",
    comment: "Excelente profissional! Meu cachorro adora os passeios e volta sempre feliz e cansado. Super recomendo para quem precisa de alguém de confiança.",
    tags: ["Pontualidade", "Cuidado", "Comunicação"],
  },
  {
    id: 2,
    name: "Carlos M.",
    rating: 5,
    service: "Pet Sitter",
    date: "28 de novembro, 2024",
    comment: "Deixei meus dois cachorros durante uma viagem de 5 dias. Recebi fotos todos os dias e eles foram muito bem cuidados. Voltarei a usar com certeza!",
    tags: ["Cuidado", "Comunicação"],
  },
  {
    id: 3,
    name: "Juliana S.",
    rating: 5,
    service: "Dog Walker",
    date: "20 de novembro, 2024",
    comment: "Pontualidade e cuidado impecáveis. Minha Luna fica animada quando vê que é dia de passeio. Nota 10!",
    tags: ["Pontualidade", "Cuidado"],
  },
  {
    id: 4,
    name: "Roberto F.",
    rating: 5,
    service: "Pet Sitter",
    date: "10 de novembro, 2024",
    comment: "Minha gata é muito arisca, mas foi muito bem tratada. Recebi atualizações constantes e fiquei tranquilo durante toda a viagem.",
    tags: ["Cuidado", "Comunicação"],
  },
  {
    id: 5,
    name: "Mariana L.",
    rating: 5,
    service: "Dog Walker",
    date: "05 de novembro, 2024",
    comment: "Ótimo serviço! Meu cachorro gasta energia e fica muito mais calmo em casa. Recomendo.",
    tags: ["Cuidado"],
  },
  {
    id: 6,
    name: "Fernando G.",
    rating: 5,
    service: "Pet Sitter",
    date: "25 de outubro, 2024",
    comment: "Profissional muito atenciosa e carinhosa. Meus pets foram tratados como se fossem dela. Confiança total.",
    tags: ["Cuidado", "Comunicação", "Pontualidade"],
  },
  {
    id: 7,
    name: "Patrícia R.",
    rating: 5,
    service: "Dog Walker",
    date: "18 de outubro, 2024",
    comment: "Serviço impecável! Sempre no horário combinado e meu dog volta muito feliz. Já indiquei para vários amigos.",
    tags: ["Pontualidade", "Cuidado"],
  },
  {
    id: 8,
    name: "Lucas H.",
    rating: 5,
    service: "Pet Sitter",
    date: "10 de outubro, 2024",
    comment: "Primeira vez usando pet sitter e a experiência foi ótima. Comunicação clara e fotos lindas do meu cachorro brincando.",
    tags: ["Comunicação", "Cuidado"],
  },
];

const Avaliacoes = () => {
  const [filter, setFilter] = useState<"all" | "Dog Walker" | "Pet Sitter">("all");

  const filteredReviews = filter === "all" 
    ? allReviews 
    : allReviews.filter(r => r.service === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="container-section">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Avaliações de clientes
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Veja o que nossos clientes dizem sobre o cuidado com seus pets
              </p>
              
              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 text-accent fill-accent" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">Clientes satisfeitos</span>
                </div>
                <div className="hidden sm:block w-px h-16 bg-border" />
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-foreground">{allReviews.length}+</span>
                  <span className="text-muted-foreground">Avaliações</span>
                </div>
                <div className="hidden sm:block w-px h-16 bg-border" />
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-foreground">100%</span>
                  <span className="text-muted-foreground">Recomendações</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews List */}
        <section className="section-padding">
          <div className="container-section">
            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>
              <div className="flex gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Todos
                </Button>
                <Button 
                  variant={filter === "Dog Walker" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilter("Dog Walker")}
                >
                  Dog Walker
                </Button>
                <Button 
                  variant={filter === "Pet Sitter" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilter("Pet Sitter")}
                >
                  Pet Sitter
                </Button>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="card-elevated p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{review.name}</h3>
                      <p className="text-sm text-muted-foreground">{review.service}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-foreground mb-4 leading-relaxed">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Quer fazer parte dessa lista de clientes satisfeitos?
              </p>
              <Button variant="hero-accent" size="xl" asChild>
                <Link to="/cadastro">Criar minha conta</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Avaliacoes;
