import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export const FAQSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase
        .from("faqs")
        .select("*")
        .eq("enabled", true)
        .order("sort_order", { ascending: true });
      
      if (data) {
        setFaqs(data);
      }
    };
    fetchFaqs();
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-12 scroll-animate ${headerVisible ? "visible" : ""}`}>
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Can't find what you're looking for?
          </p>
        </div>

        {/* FAQ Accordion */}
        <div ref={contentRef}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className={`glass-card px-6 border-none scroll-animate ${contentVisible ? "visible" : ""} stagger-${Math.min(index + 1, 6)}`}
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
        </div>

        {/* Documentation Link */}
        <p className={`text-center text-muted-foreground mt-8 scroll-animate ${contentVisible ? "visible" : ""}`}>
          Did we miss something? Check out our{" "}
          <a href="#" className="text-primary hover:underline">Documentation</a>
        </p>
      </div>
    </section>
  );
};
