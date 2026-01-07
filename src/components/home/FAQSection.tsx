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
      "O pagamento é feito de forma segura pelo nosso site após o agendamento. Aceitamos cartão de crédito e PIX. Você só paga após a confirmação do serviço.",
  },
  {
    question: "Posso agendar para mais de um pet?",
    answer:
      "Sim! Você pode cadastrar quantos pets quiser e agendar serviços para um ou mais ao mesmo tempo. Há um valor adicional por pet extra.",
  },
  {
    question: "Como recebo atualizações durante o serviço?",
    answer:
      "Enviamos fotos e atualizações por WhatsApp durante e após cada passeio ou visita. Você acompanha tudo em tempo real.",
  },
  {
    question: "Qual a política de cancelamento?",
    answer:
      "Cancelamentos com até 24h de antecedência têm reembolso integral. Cancelamentos com menos de 24h estão sujeitos à cobrança de 50% do valor.",
  },
  {
    question: "Quais regiões são atendidas?",
    answer:
      "Atendemos a região central e zona oeste de São Paulo. Consulte a disponibilidade para seu bairro no momento do agendamento.",
  },
  {
    question: "Meu pet precisa estar com vacinas em dia?",
    answer:
      "Sim, para segurança de todos os pets, solicitamos que as vacinas estejam atualizadas. Informe no cadastro do pet.",
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
              Tire suas dúvidas sobre nossos serviços
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
