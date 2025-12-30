import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Where are your servers located?",
    answer: "All of our servers are currently based in the United States with data centers strategically located to provide optimal performance and low latency for North American users."
  },
  {
    question: "How much technical knowledge do I need to run a game server?",
    answer: "Very little! Our control panel is designed to be user-friendly and intuitive. We provide one-click installations, easy configuration options, and comprehensive documentation to help you get started quickly."
  },
  {
    question: "How secure is my information at Sano?",
    answer: "We take security very seriously. All data is encrypted, and we implement industry-standard security practices including DDoS protection, regular security audits, and secure authentication methods."
  },
  {
    question: "Is it possible for my server to be DDoS attacked?",
    answer: "While DDoS attacks can target any online service, our servers are protected behind 4+ TB of PATH.Net DDoS protection with game-specific filtering to mitigate and stop attacks effectively."
  },
  {
    question: "Can I request a custom service?",
    answer: "Absolutely! We're always open to discussing custom solutions. Reach out to our support team through Discord or our contact form to discuss your specific needs."
  },
  {
    question: "Why is Sano free?",
    answer: "We believe everyone should have access to quality game server hosting. Our free tier is supported by our premium services and community donations, allowing us to offer reliable hosting at no cost."
  },
  {
    question: "My server is on, but I can't connect.",
    answer: "This is usually a configuration issue. Check that your server's port is correctly configured, ensure any firewalls are properly set up, and verify your connection details. Our documentation and support team can help troubleshoot further."
  }
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Can't find what you're looking for?
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card px-6 border-none"
            >
              <AccordionTrigger className="text-left hover:no-underline hover:text-primary py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Documentation Link */}
        <p className="text-center text-muted-foreground mt-8">
          Did we miss something? Check out our{" "}
          <a href="#" className="text-primary hover:underline">Documentation</a>
        </p>
      </div>
    </section>
  );
};
