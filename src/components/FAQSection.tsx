import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { FAQSkeleton } from "./Skeleton";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  if (faqs.length === 0 && !loading) return null;

  // Loading skeleton
  const LoadingSkeleton = () => (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="h-10 w-80 bg-muted/50 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-48 bg-muted/50 rounded mx-auto animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <FAQSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Can't find what you're looking for?
          </p>
        </div>

        {/* FAQ Accordion */}
        <div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="glass-card px-6 border-none animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
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
        <p className="text-center text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
          Did we miss something? Check out our{" "}
          <a href="#" className="text-primary hover:underline">Documentation</a>
        </p>
      </div>
    </section>
  );
};
