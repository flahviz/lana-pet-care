import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Agendamento e Serviços",
    items: [
      {
        question: "Como faço para agendar um serviço?",
        answer: "Primeiro, crie sua conta gratuita. Depois, cadastre seu pet e escolha o serviço desejado (Dog Walker ou Pet Sitter). Selecione a data e horário disponível, faça o pagamento seguro e pronto!",
      },
      {
        question: "Posso agendar para mais de um pet?",
        answer: "Sim! Você pode cadastrar quantos pets quiser e agendar serviços para um ou mais ao mesmo tempo. Há um valor adicional por pet extra, que será exibido no momento do agendamento.",
      },
      {
        question: "Quais são os horários disponíveis?",
        answer: "Os horários variam de acordo com a agenda. De modo geral, atendo de segunda a sexta, das 8h às 18h. Finais de semana sob consulta. Você verá os horários disponíveis no momento do agendamento.",
      },
      {
        question: "Com quanto tempo de antecedência preciso agendar?",
        answer: "Recomendamos agendar com pelo menos 24 horas de antecedência. Para serviços de pet sitter com pernoite, o ideal é agendar com 1 semana de antecedência.",
      },
    ],
  },
  {
    title: "Pagamento e Cancelamento",
    items: [
      {
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos cartão de crédito (em até 3x sem juros) e PIX. O pagamento é processado de forma segura no momento da confirmação do agendamento.",
      },
      {
        question: "Qual a política de cancelamento?",
        answer: "Cancelamentos com até 24 horas de antecedência têm reembolso integral. Cancelamentos com menos de 24 horas estão sujeitos à cobrança de 50% do valor. Não comparecimento sem aviso: cobrança integral.",
      },
      {
        question: "E se precisar remarcar?",
        answer: "Você pode remarcar gratuitamente com até 24 horas de antecedência, sujeito à disponibilidade de horários. Basta acessar 'Meus Pedidos' e solicitar a alteração.",
      },
    ],
  },
  {
    title: "Serviços Dog Walker",
    items: [
      {
        question: "Quanto tempo dura um passeio?",
        answer: "Oferecemos passeios de 30 ou 60 minutos. O tempo começa a contar a partir da saída do seu endereço e inclui o trajeto completo de ida e volta.",
      },
      {
        question: "Meu cão passeia sozinho ou em grupo?",
        answer: "Todos os passeios são individuais, garantindo atenção exclusiva ao seu cão. Caso você tenha mais de um pet, eles podem passear juntos mediante valor adicional.",
      },
      {
        question: "E se chover no dia do passeio?",
        answer: "Em caso de chuva forte, entramos em contato para remarcar sem custo adicional. Se for uma chuva leve e você preferir manter o passeio, podemos adaptar o trajeto para locais cobertos.",
      },
    ],
  },
  {
    title: "Serviços Pet Sitter",
    items: [
      {
        question: "O que está incluído no serviço de pet sitter?",
        answer: "O serviço inclui alimentação, água fresca, brincadeiras, carinho e atenção ao bem-estar do pet. Medicação e cuidados especiais podem ser incluídos sob consulta.",
      },
      {
        question: "Onde meu pet fica durante a hospedagem?",
        answer: "Na hospedagem com pernoite, seu pet fica na minha casa, em ambiente seguro, limpo e confortável. Nas visitas, eu vou até a sua casa cuidar do pet no ambiente dele.",
      },
      {
        question: "Posso receber atualizações durante o serviço?",
        answer: "Sim! Envio fotos e atualizações por WhatsApp durante e após cada atendimento. Você acompanha tudo e fica tranquilo sabendo que seu pet está bem.",
      },
    ],
  },
];

const Ajuda = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="section-padding bg-secondary">
          <div className="container-section">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Central de Ajuda
              </h1>
              <p className="text-lg text-muted-foreground">
                Encontre respostas para suas dúvidas ou entre em contato conosco
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding">
          <div className="container-section">
            <div className="max-w-3xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12 last:mb-0">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem
                        key={itemIndex}
                        value={`${categoryIndex}-${itemIndex}`}
                        className="bg-secondary rounded-xl border-0 px-6 data-[state=open]:shadow-card"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section-padding bg-primary">
          <div className="container-section">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ainda tem dúvidas?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Entre em contato por um dos canais abaixo
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <a 
                  href="mailto:lanapetcare@gmail.com" 
                  className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
                >
                  <Mail className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                  <p className="font-semibold text-primary-foreground">E-mail</p>
                  <p className="text-sm text-primary-foreground/70">lanapetcare@gmail.com</p>
                </a>
                
                {user ? (
                  <a 
                    href="tel:+5548999999999" 
                    className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Phone className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                    <p className="font-semibold text-primary-foreground">Telefone</p>
                    <p className="text-sm text-primary-foreground/70">(48) 99999-9999</p>
                  </a>
                ) : (
                  <div className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                    <Lock className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                    <p className="font-semibold text-primary-foreground">Telefone</p>
                    <Link to="/cadastro" className="text-sm text-primary-foreground/70 underline hover:text-primary-foreground">
                      Cadastre-se para ver
                    </Link>
                  </div>
                )}
                
                {user ? (
                  <a 
                    href="https://wa.me/5548999999999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <MessageCircle className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                    <p className="font-semibold text-primary-foreground">WhatsApp</p>
                    <p className="text-sm text-primary-foreground/70">Mensagem rápida</p>
                  </a>
                ) : (
                  <div className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                    <Lock className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                    <p className="font-semibold text-primary-foreground">WhatsApp</p>
                    <Link to="/cadastro" className="text-sm text-primary-foreground/70 underline hover:text-primary-foreground">
                      Cadastre-se para ver
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ajuda;
