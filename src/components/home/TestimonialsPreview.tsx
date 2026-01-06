import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ana P.",
    rating: 5,
    service: "Dog Walker",
    date: "Dezembro 2024",
    comment:
      "Excelente profissional! Meu cachorro adora os passeios e volta sempre feliz e cansado. Super recomendo.",
  },
  {
    id: 2,
    name: "Carlos M.",
    rating: 5,
    service: "Pet Sitter",
    date: "Novembro 2024",
    comment:
      "Deixei meus dois cachorros durante uma viagem de 5 dias. Recebi fotos todos os dias e eles foram muito bem cuidados.",
  },
  {
    id: 3,
    name: "Juliana S.",
    rating: 5,
    service: "Dog Walker",
    date: "Novembro 2024",
    comment:
      "Pontualidade e cuidado impecaveis. Minha Luna fica animada quando ve que e dia de passeio.",
  },
];

const TestimonialsPreview = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-section">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que dizem os clientes
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">4.9</span>
              <span className="text-muted-foreground">
                nota media
              </span>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/avaliacoes">
              Ver todas as avaliacoes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card-elevated p-6"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                </div>
                <span className="text-sm text-muted-foreground">{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
