import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Agendamento e Servicos",
    items: [
      {
        question: "Como faco para agendar um servico?",
        answer: "Primeiro, crie sua conta gratuita. Depois, cadastre seu pet e escolha o servico desejado (Dog Walker ou Pet Sitter). Selecione a data e horario disponivel, faca o pagamento seguro e pronto!",
      },
      {
        question: "Posso agendar para mais de um pet?",
        answer: "Sim! Voce pode cadastrar quantos pets quiser e agendar servicos para um ou mais ao mesmo tempo. Ha um valor adicional por pet extra, que sera exibido no momento do agendamento.",
      },
      {
        question: "Quais sao os horarios disponiveis?",
        answer: "Os horarios variam de acordo com a agenda. De modo geral, atendo de segunda a sexta, das 8h as 18h. Finais de semana sob consulta. Voce vera os horarios disponiveis no momento do agendamento.",
      },
      {
        question: "Com quanto tempo de antecedencia preciso agendar?",
        answer: "Recomendamos agendar com pelo menos 24 horas de antecedencia. Para servicos de pet sitter com pernoite, o ideal e agendar com 1 semana de antecedencia.",
      },
    ],
  },
  {
    title: "Pagamento e Cancelamento",
    items: [
      {
        question: "Quais formas de pagamento sao aceitas?",
        answer: "Aceitamos cartao de credito (em ate 3x sem juros) e PIX. O pagamento e processado de forma segura no momento da confirmacao do agendamento.",
      },
      {
        question: "Qual a politica de cancelamento?",
        answer: "Cancelamentos com ate 24 horas de antecedencia tem reembolso integral. Cancelamentos com menos de 24 horas estao sujeitos a cobranca de 50% do valor. Nao comparecimento sem aviso: cobranca integral.",
      },
      {
        question: "E se precisar remarcar?",
        answer: "Voce pode remarcar gratuitamente com ate 24 horas de antecedencia, sujeito a disponibilidade de horarios. Basta acessar 'Meus Pedidos' e solicitar a alteracao.",
      },
    ],
  },
  {
    title: "Servicos Dog Walker",
    items: [
      {
        question: "Quanto tempo dura um passeio?",
        answer: "Oferecemos passeios de 30 ou 60 minutos. O tempo começa a contar a partir da saida do seu endereco e inclui o trajeto completo de ida e volta.",
      },
      {
        question: "Meu cao passeia sozinho ou em grupo?",
        answer: "Todos os passeios sao individuais, garantindo atencao exclusiva ao seu cao. Caso voce tenha mais de um pet, eles podem passear juntos mediante valor adicional.",
      },
      {
        question: "E se chover no dia do passeio?",
        answer: "Em caso de chuva forte, entramos em contato para remarcar sem custo adicional. Se for uma chuva leve e voce preferir manter o passeio, podemos adaptar o trajeto para locais cobertos.",
      },
    ],
  },
  {
    title: "Servicos Pet Sitter",
    items: [
      {
        question: "O que esta incluido no servico de pet sitter?",
        answer: "O servico inclui alimentacao, agua fresca, brincadeiras, carinho e atencao ao bem-estar do pet. Medicacao e cuidados especiais podem ser incluidos sob consulta.",
      },
      {
        question: "Onde meu pet fica durante a hospedagem?",
        answer: "Na hospedagem com pernoite, seu pet fica na minha casa, em ambiente seguro, limpo e confortavel. Nas visitas, eu vou ate a sua casa cuidar do pet no ambiente dele.",
      },
      {
        question: "Posso receber atualizacoes durante o servico?",
        answer: "Sim! Envio fotos e atualizacoes por WhatsApp durante e apos cada atendimento. Voce acompanha tudo e fica tranquilo sabendo que seu pet esta bem.",
      },
    ],
  },
];

const Ajuda = () => {
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
                Encontre respostas para suas duvidas ou entre em contato conosco
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
                Ainda tem duvidas?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Entre em contato por um dos canais abaixo
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <a 
                  href="mailto:contato@petcare.com" 
                  className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
                >
                  <Mail className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                  <p className="font-semibold text-primary-foreground">E-mail</p>
                  <p className="text-sm text-primary-foreground/70">contato@petcare.com</p>
                </a>
                
                <a 
                  href="tel:+5511999999999" 
                  className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
                >
                  <Phone className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                  <p className="font-semibold text-primary-foreground">Telefone</p>
                  <p className="text-sm text-primary-foreground/70">(11) 99999-9999</p>
                </a>
                
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
                >
                  <MessageCircle className="w-8 h-8 text-primary-foreground mx-auto mb-3" />
                  <p className="font-semibold text-primary-foreground">WhatsApp</p>
                  <p className="text-sm text-primary-foreground/70">Mensagem rapida</p>
                </a>
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
