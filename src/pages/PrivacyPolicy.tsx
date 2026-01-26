import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PrivacySettings {
  privacy_policy_title: string;
  privacy_policy_content: string;
  privacy_policy_last_updated: string;
}

export default function PrivacyPolicy() {
  const [settings, setSettings] = useState<PrivacySettings>({
    privacy_policy_title: "Privacy Policy",
    privacy_policy_content: "",
    privacy_policy_last_updated: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((item: { setting_key: string; setting_value: string }) => {
          settingsMap[item.setting_key] = item.setting_value || "";
        });
        setSettings((prev) => ({
          ...prev,
          privacy_policy_title: settingsMap.privacy_policy_title || "Privacy Policy",
          privacy_policy_content: settingsMap.privacy_policy_content || getDefaultContent(),
          privacy_policy_last_updated: settingsMap.privacy_policy_last_updated || new Date().toISOString().split("T")[0],
        }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${settings.privacy_policy_title} - KineticHost`}
        description="Read our privacy policy to understand how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, cookies, GDPR, personal data"
      />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{settings.privacy_policy_title}</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date(settings.privacy_policy_last_updated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          
          <div 
            className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: formatContent(settings.privacy_policy_content) }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function getDefaultContent(): string {
  return `## Introduction

Welcome to KineticHost. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website and use our services.

## Information We Collect

### Personal Information
When you create an account or purchase our services, we may collect:
- Name and email address
- Billing information and payment details
- Contact information

### Automatically Collected Information
We automatically collect certain information when you visit our website:
- IP address and browser type
- Device information
- Pages visited and time spent
- Referral source

## Cookies and Tracking

### What Are Cookies?
Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.

### Types of Cookies We Use
- **Essential Cookies**: Required for the website to function properly
- **Analytics Cookies**: Help us understand how visitors interact with our website
- **Preference Cookies**: Remember your settings and preferences

### Managing Cookies
You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.

## How We Use Your Information

We use collected information to:
- Provide and maintain our services
- Process transactions and send related information
- Send promotional communications (with your consent)
- Improve our website and services
- Comply with legal obligations

## Data Security

We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.

## Your Rights

Depending on your location, you may have rights including:
- Access to your personal data
- Correction of inaccurate data
- Deletion of your data
- Data portability
- Opt-out of marketing communications

## Third-Party Services

We may use third-party services that collect information. These include:
- Payment processors
- Analytics providers
- Hosting services

## Children's Privacy

Our services are not intended for children under 13. We do not knowingly collect personal information from children.

## Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

## Contact Us

If you have questions about this privacy policy, please contact us through our support channels.`;
}

function formatContent(content: string): string {
  // Convert markdown-like syntax to HTML
  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Line breaks
    .replace(/\n/g, '<br/>');
  
  // Wrap in paragraph
  html = `<p class="mb-4">${html}</p>`;
  
  // Fix list grouping
  html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, (match) => `<ul class="list-disc mb-4 space-y-2">${match}</ul>`);
  
  return html;
}
