import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento e feito de forma segura pelo nosso site apos o agendamento. Aceitamos cartao de credito e PIX. Voce so paga apos a confirmacao do servico.",
  },
  {
    question: "Posso agendar para mais de um pet?",
    answer:
      "Sim! Voce pode cadastrar quantos pets quiser e agendar servicos para um ou mais ao mesmo tempo. Ha um valor adicional por pet extra.",
  },
  {
    question: "Como recebo atualizacoes durante o servico?",
    answer:
      "Enviamos fotos e atualizacoes por WhatsApp durante e apos cada passeio ou visita. Voce acompanha tudo em tempo real.",
  },
  {
    question: "Qual a politica de cancelamento?",
    answer:
      "Cancelamentos com ate 24h de antecedencia tem reembolso integral. Cancelamentos com menos de 24h estao sujeitos a cobranca de 50% do valor.",
  },
  {
    question: "Quais regioes sao atendidas?",
    answer:
      "Atendemos a regiao central e zona oeste de Sao Paulo. Consulte a disponibilidade para seu bairro no momento do agendamento.",
  },
  {
    question: "Meu pet precisa estar com vacinas em dia?",
    answer:
      "Sim, para seguranca de todos os pets, solicitamos que as vacinas estejam atualizadas. Informe no cadastro do pet.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-section">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tire suas duvidas sobre nossos servicos
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl border border-border px-6 data-[state=open]:shadow-card"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
