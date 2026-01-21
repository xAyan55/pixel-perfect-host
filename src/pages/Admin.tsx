import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut, Plus, Pencil, Trash2, Gamepad2, Cloud, Globe, Bot,
  Loader2, Save, X, HardDrive, Cpu, Wifi, Settings, Upload, Image,
  HelpCircle, Link as LinkIcon, Sparkles
} from "lucide-react";

type Category = "game" | "vps" | "web" | "bot";

interface Plan {
  id: string;
  category: Category;
  name: string;
  price: number;
  billing_cycle: string;
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  features: string[];
  redirect_url: string;
  popular: boolean;
  enabled: boolean;
  sort_order: number;
  image_url?: string;
  game_type?: string;
  game_subtype?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  enabled: boolean;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  enabled: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  enabled: boolean;
}

interface SiteSettings {
  get_started_url: string;
  free_server_url: string;
  free_server_enabled: string;
  logo_url: string;
  favicon_url: string;
  panel_preview_url: string;
  control_panel_url: string;
  featured_banner_title: string;
  featured_banner_subtitle: string;
  featured_banner_image_url: string;
  features_section_logo_url: string;
  features_section_subtitle: string;
  watch_demo_url: string;
  game_hero_image_url: string;
  vps_hero_image_url: string;
  web_hero_image_url: string;
  bot_hero_image_url: string;
  minecraft_hero_image_url: string;
  hytale_hero_image_url: string;
  terraria_hero_image_url: string;
  // Game category card images
  minecraft_card_image_url: string;
  hytale_card_image_url: string;
  terraria_card_image_url: string;
  // Minecraft subtype card images
  minecraft_java_card_image_url: string;
  minecraft_bedrock_card_image_url: string;
  minecraft_crossplay_card_image_url: string;
  // Hytale subtype card images
  hytale_budget_card_image_url: string;
  hytale_premium_card_image_url: string;
  // Terraria subtype card images
  terraria_budget_card_image_url: string;
  terraria_premium_card_image_url: string;
}

const categoryIcons = {
  game: <Gamepad2 className="w-4 h-4" />,
  vps: <Cloud className="w-4 h-4" />,
  web: <Globe className="w-4 h-4" />,
  bot: <Bot className="w-4 h-4" />,
};

const categoryNames = {
  game: "Game Hosting",
  vps: "Cloud VPS",
  web: "Web Hosting",
  bot: "Bot Hosting",
};

const emptyPlan: Omit<Plan, "id"> = {
  category: "game",
  name: "",
  price: 0,
  billing_cycle: "month",
  ram: "",
  cpu: "",
  storage: "",
  bandwidth: "",
  features: [],
  redirect_url: "",
  popular: false,
  enabled: true,
  sort_order: 0,
  image_url: "",
  game_type: "",
  game_subtype: "",
};

const emptyFaq: Omit<FAQ, "id"> = {
  question: "",
  answer: "",
  sort_order: 0,
  enabled: true,
};

const emptySocialLink: Omit<SocialLink, "id"> = {
  platform: "",
  url: "",
  icon: "discord",
  sort_order: 0,
  enabled: true,
};

const emptyFeature: Omit<Feature, "id"> = {
  title: "",
  description: "",
  icon: "settings",
  sort_order: 0,
  enabled: true,
};

export default function Admin() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("game");
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"plan" | "faq" | "social" | "feature">("plan");
  const [isSaving, setIsSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");
  const [activeTab, setActiveTab] = useState("plans");
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    get_started_url: "",
    free_server_url: "",
    free_server_enabled: "true",
    logo_url: "",
    favicon_url: "",
    panel_preview_url: "",
    control_panel_url: "",
    featured_banner_title: "UPDATE AVAILABLE",
    featured_banner_subtitle: "Featured Server",
    featured_banner_image_url: "",
    features_section_logo_url: "",
    features_section_subtitle: "Advanced tools to manage, customize, and create your server",
    watch_demo_url: "",
    game_hero_image_url: "",
    vps_hero_image_url: "",
    web_hero_image_url: "",
    bot_hero_image_url: "",
    minecraft_hero_image_url: "",
    hytale_hero_image_url: "",
    terraria_hero_image_url: "",
    // Game category card images
    minecraft_card_image_url: "",
    hytale_card_image_url: "",
    terraria_card_image_url: "",
    // Minecraft subtype card images
    minecraft_java_card_image_url: "",
    minecraft_bedrock_card_image_url: "",
    minecraft_crossplay_card_image_url: "",
    // Hytale subtype card images
    hytale_budget_card_image_url: "",
    hytale_premium_card_image_url: "",
    // Terraria subtype card images
    terraria_budget_card_image_url: "",
    terraria_premium_card_image_url: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPlans();
      fetchFaqs();
      fetchSocialLinks();
      fetchFeatures();
      fetchSiteSettings();
    }
  }, [user, isAdmin]);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    const { data, error } = await supabase
      .from("hosting_plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load plans" });
    } else {
      setPlans((data as Plan[]) || []);
    }
    setLoadingPlans(false);
  };

  const fetchFaqs = async () => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    if (data) setFaqs(data);
  };

  const fetchSocialLinks = async () => {
    const { data } = await supabase.from("social_links").select("*").order("sort_order", { ascending: true });
    if (data) setSocialLinks(data);
  };

  const fetchFeatures = async () => {
    const { data } = await supabase.from("features").select("*").order("sort_order", { ascending: true });
    if (data) setFeatures(data);
  };

  const fetchSiteSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((item: { setting_key: string; setting_value: string }) => {
        settingsMap[item.setting_key] = item.setting_value || "";
      });
      setSiteSettings((prev) => ({ ...prev, ...settingsMap }));
    }
  };

  // Plan handlers
  const handleCreatePlan = () => {
    setEditingPlan({ ...emptyPlan, id: "", category: activeCategory } as Plan);
    setFeaturesText("");
    setDialogType("plan");
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFeaturesText(plan.features.join("\n"));
    setDialogType("plan");
    setIsDialogOpen(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    setIsSaving(true);

    const planData = {
      ...editingPlan,
      features: featuresText.split("\n").filter((f) => f.trim()),
    };

    if (editingPlan.id) {
      const { error } = await supabase
        .from("hosting_plans")
        .update({
          name: planData.name,
          price: planData.price,
          billing_cycle: planData.billing_cycle,
          ram: planData.ram,
          cpu: planData.cpu,
          storage: planData.storage,
          bandwidth: planData.bandwidth,
          features: planData.features,
          redirect_url: planData.redirect_url,
          popular: planData.popular,
          enabled: planData.enabled,
          sort_order: planData.sort_order,
          image_url: planData.image_url,
          game_type: planData.game_type,
          game_subtype: planData.game_subtype,
        })
        .eq("id", editingPlan.id);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update plan" });
      } else {
        toast({ title: "Success", description: "Plan updated successfully" });
        fetchPlans();
      }
    } else {
      const { error } = await supabase.from("hosting_plans").insert({
        category: planData.category,
        name: planData.name,
        price: planData.price,
        billing_cycle: planData.billing_cycle,
        ram: planData.ram,
        cpu: planData.cpu,
        storage: planData.storage,
        bandwidth: planData.bandwidth,
        features: planData.features,
        redirect_url: planData.redirect_url,
        popular: planData.popular,
        enabled: planData.enabled,
        sort_order: planData.sort_order,
        image_url: planData.image_url,
        game_type: planData.game_type,
        game_subtype: planData.game_subtype,
      });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to create plan" });
      } else {
        toast({ title: "Success", description: "Plan created successfully" });
        fetchPlans();
      }
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    const { error } = await supabase.from("hosting_plans").delete().eq("id", planId);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete plan" });
    } else {
      toast({ title: "Success", description: "Plan deleted successfully" });
      fetchPlans();
    }
  };

  const handleToggleEnabled = async (plan: Plan) => {
    const { error } = await supabase.from("hosting_plans").update({ enabled: !plan.enabled }).eq("id", plan.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update plan" });
    } else {
      fetchPlans();
    }
  };

  // FAQ handlers
  const handleCreateFaq = () => {
    setEditingFaq({ ...emptyFaq, id: "" } as FAQ);
    setDialogType("faq");
    setIsDialogOpen(true);
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setDialogType("faq");
    setIsDialogOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!editingFaq) return;
    setIsSaving(true);

    if (editingFaq.id) {
      const { error } = await supabase.from("faqs").update({
        question: editingFaq.question,
        answer: editingFaq.answer,
        sort_order: editingFaq.sort_order,
        enabled: editingFaq.enabled,
      }).eq("id", editingFaq.id);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update FAQ" });
      } else {
        toast({ title: "Success", description: "FAQ updated successfully" });
        fetchFaqs();
      }
    } else {
      const { error } = await supabase.from("faqs").insert({
        question: editingFaq.question,
        answer: editingFaq.answer,
        sort_order: editingFaq.sort_order,
        enabled: editingFaq.enabled,
      });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to create FAQ" });
      } else {
        toast({ title: "Success", description: "FAQ created successfully" });
        fetchFaqs();
      }
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    setEditingFaq(null);
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", faqId);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete FAQ" });
    } else {
      toast({ title: "Success", description: "FAQ deleted successfully" });
      fetchFaqs();
    }
  };

  // Social Link handlers
  const handleCreateSocialLink = () => {
    setEditingSocialLink({ ...emptySocialLink, id: "" } as SocialLink);
    setDialogType("social");
    setIsDialogOpen(true);
  };

  const handleEditSocialLink = (link: SocialLink) => {
    setEditingSocialLink(link);
    setDialogType("social");
    setIsDialogOpen(true);
  };

  const handleSaveSocialLink = async () => {
    if (!editingSocialLink) return;
    setIsSaving(true);

    if (editingSocialLink.id) {
      const { error } = await supabase.from("social_links").update({
        platform: editingSocialLink.platform,
        url: editingSocialLink.url,
        icon: editingSocialLink.icon,
        sort_order: editingSocialLink.sort_order,
        enabled: editingSocialLink.enabled,
      }).eq("id", editingSocialLink.id);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update social link" });
      } else {
        toast({ title: "Success", description: "Social link updated successfully" });
        fetchSocialLinks();
      }
    } else {
      const { error } = await supabase.from("social_links").insert({
        platform: editingSocialLink.platform,
        url: editingSocialLink.url,
        icon: editingSocialLink.icon,
        sort_order: editingSocialLink.sort_order,
        enabled: editingSocialLink.enabled,
      });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to create social link" });
      } else {
        toast({ title: "Success", description: "Social link created successfully" });
        fetchSocialLinks();
      }
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    setEditingSocialLink(null);
  };

  const handleDeleteSocialLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    const { error } = await supabase.from("social_links").delete().eq("id", linkId);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete social link" });
    } else {
      toast({ title: "Success", description: "Social link deleted successfully" });
      fetchSocialLinks();
    }
  };

  // Feature handlers
  const handleCreateFeature = () => {
    setEditingFeature({ ...emptyFeature, id: "" } as Feature);
    setDialogType("feature");
    setIsDialogOpen(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setDialogType("feature");
    setIsDialogOpen(true);
  };

  const handleSaveFeature = async () => {
    if (!editingFeature) return;
    setIsSaving(true);

    if (editingFeature.id) {
      const { error } = await supabase.from("features").update({
        title: editingFeature.title,
        description: editingFeature.description,
        icon: editingFeature.icon,
        sort_order: editingFeature.sort_order,
        enabled: editingFeature.enabled,
      }).eq("id", editingFeature.id);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update feature" });
      } else {
        toast({ title: "Success", description: "Feature updated successfully" });
        fetchFeatures();
      }
    } else {
      const { error } = await supabase.from("features").insert({
        title: editingFeature.title,
        description: editingFeature.description,
        icon: editingFeature.icon,
        sort_order: editingFeature.sort_order,
        enabled: editingFeature.enabled,
      });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to create feature" });
      } else {
        toast({ title: "Success", description: "Feature created successfully" });
        fetchFeatures();
      }
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    setEditingFeature(null);
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    const { error } = await supabase.from("features").delete().eq("id", featureId);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete feature" });
    } else {
      toast({ title: "Success", description: "Feature deleted successfully" });
      fetchFeatures();
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    
    for (const [key, value] of Object.entries(siteSettings)) {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ setting_key: key, setting_value: value }, { onConflict: "setting_key" });
      
      if (error) {
        toast({ variant: "destructive", title: "Error", description: `Failed to save ${key}` });
        setSavingSettings(false);
        return;
      }
    }
    
    toast({ title: "Success", description: "Settings saved successfully" });
    setSavingSettings(false);
  };

  const handleImageUpload = async (
    file: File, 
    type: "logo" | "favicon" | "panel_preview" | "featured_banner" | "features_section_logo" | "plan" | "game_hero" | "vps_hero" | "web_hero" | "bot_hero" | "minecraft_hero" | "hytale_hero" | "terraria_hero" | "minecraft_card" | "hytale_card" | "terraria_card" | "minecraft_java_card" | "minecraft_bedrock_card" | "minecraft_crossplay_card" | "hytale_budget_card" | "hytale_premium_card" | "terraria_budget_card" | "terraria_premium_card",
    planId?: string
  ) => {
    setUploadingImage(type === "plan" ? planId! : type);
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ variant: "destructive", title: "Error", description: "Failed to upload image" });
      setUploadingImage(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // Map type to setting key
    const typeToSettingKey: Record<string, keyof SiteSettings> = {
      logo: "logo_url",
      favicon: "favicon_url",
      panel_preview: "panel_preview_url",
      featured_banner: "featured_banner_image_url",
      features_section_logo: "features_section_logo_url",
      game_hero: "game_hero_image_url",
      vps_hero: "vps_hero_image_url",
      web_hero: "web_hero_image_url",
      bot_hero: "bot_hero_image_url",
      minecraft_hero: "minecraft_hero_image_url",
      hytale_hero: "hytale_hero_image_url",
      terraria_hero: "terraria_hero_image_url",
      minecraft_card: "minecraft_card_image_url",
      hytale_card: "hytale_card_image_url",
      terraria_card: "terraria_card_image_url",
      minecraft_java_card: "minecraft_java_card_image_url",
      minecraft_bedrock_card: "minecraft_bedrock_card_image_url",
      minecraft_crossplay_card: "minecraft_crossplay_card_image_url",
      hytale_budget_card: "hytale_budget_card_image_url",
      hytale_premium_card: "hytale_premium_card_image_url",
      terraria_budget_card: "terraria_budget_card_image_url",
      terraria_premium_card: "terraria_premium_card_image_url",
    };

    if (type === "plan" && editingPlan) {
      setEditingPlan({ ...editingPlan, image_url: publicUrl });
    } else if (typeToSettingKey[type]) {
      setSiteSettings((prev) => ({ ...prev, [typeToSettingKey[type]]: publicUrl }));
    }

    toast({ title: "Success", description: "Image uploaded successfully" });
    setUploadingImage(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredPlans = plans.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg">
                <span className="text-primary">KINETIC</span>HOST
              </h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 border border-border/50 flex-wrap">
            <TabsTrigger value="plans" className="data-[state=active]:bg-primary">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="faqs" className="data-[state=active]:bg-primary">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-primary">
              <LinkIcon className="w-4 h-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {(Object.keys(categoryNames) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 text-muted-foreground hover:bg-card border border-border/50"
                  }`}
                >
                  {categoryIcons[cat]}
                  {categoryNames[cat]}
                  <Badge variant="secondary" className="ml-1">
                    {plans.filter((p) => p.category === cat).length}
                  </Badge>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{categoryNames[activeCategory]} Plans</h2>
              <Button onClick={handleCreatePlan}>
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </div>

            {loadingPlans ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredPlans.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No plans found. Create your first plan!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className={`bg-card/50 border-border/50 relative ${!plan.enabled ? "opacity-60" : ""}`}>
                    {plan.popular && <Badge className="absolute top-2 right-2 bg-primary">Popular</Badge>}
                    {plan.image_url && (
                      <div className="h-32 overflow-hidden rounded-t-lg">
                        <img src={plan.image_url} alt={plan.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Switch checked={plan.enabled} onCheckedChange={() => handleToggleEnabled(plan)} />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">${plan.price}</span>
                        <span className="text-muted-foreground">/{plan.billing_cycle}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">RAM:</span>
                          <span>{plan.ram}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">CPU:</span>
                          <span>{plan.cpu}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">Disk:</span>
                          <span>{plan.storage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">BW:</span>
                          <span>{plan.bandwidth}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditPlan(plan)}>
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Features</h2>
              <Button onClick={handleCreateFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {features.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No features found. Add your first feature!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature) => (
                  <Card key={feature.id} className={`bg-card/50 border-border/50 ${!feature.enabled ? "opacity-60" : ""}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">#{feature.sort_order}</Badge>
                            <Badge variant="outline">{feature.icon}</Badge>
                          </div>
                          <h4 className="font-medium mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditFeature(feature)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteFeature(feature.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage FAQs</h2>
              <Button onClick={handleCreateFaq}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            {faqs.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No FAQs found. Add your first FAQ!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className={`bg-card/50 border-border/50 ${!faq.enabled ? "opacity-60" : ""}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">#{faq.sort_order}</Badge>
                          <Button variant="outline" size="sm" onClick={() => handleEditFaq(faq)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteFaq(faq.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Social Links</h2>
              <Button onClick={handleCreateSocialLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>

            {socialLinks.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No social links found. Add your first link!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialLinks.map((link) => (
                  <Card key={link.id} className={`bg-card/50 border-border/50 ${!link.enabled ? "opacity-60" : ""}`}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">{link.icon.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{link.platform}</h4>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{link.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditSocialLink(link)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteSocialLink(link.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Button URLs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Control Panel URL</label>
                    <Input
                      value={siteSettings.control_panel_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, control_panel_url: e.target.value })}
                      placeholder="https://panel.example.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">URL for the Control Panel button in navbar</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Free Server Button URL</label>
                    <Input
                      value={siteSettings.free_server_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, free_server_url: e.target.value })}
                      placeholder="https://billing.example.com/free"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Watch Demo URL</label>
                    <Input
                      value={siteSettings.watch_demo_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, watch_demo_url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">URL for the "Watch Demo" button on game servers page</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={siteSettings.free_server_enabled === "true"}
                      onCheckedChange={(checked) =>
                        setSiteSettings({ ...siteSettings, free_server_enabled: checked ? "true" : "false" })
                      }
                    />
                    <label className="text-sm font-medium">Show "Claim Free Server" Button</label>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Site Logo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {siteSettings.logo_url ? (
                      <img src={siteSettings.logo_url} alt="Logo" className="h-16 w-auto rounded" />
                    ) : (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                        <Image className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        value={siteSettings.logo_url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, logo_url: e.target.value })}
                        placeholder="Logo URL"
                        className="mb-2"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "logo");
                          }}
                        />
                        <Button variant="outline" size="sm" asChild disabled={uploadingImage === "logo"}>
                          <span>
                            {uploadingImage === "logo" ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Site Favicon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The favicon appears in browser tabs and bookmarks. Recommended size: 32x32 or 64x64 pixels.
                  </p>
                  <div className="flex items-center gap-4">
                    {siteSettings.favicon_url ? (
                      <img src={siteSettings.favicon_url} alt="Favicon" className="h-12 w-12 rounded object-contain bg-muted p-1" />
                    ) : (
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                        <Image className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        value={siteSettings.favicon_url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, favicon_url: e.target.value })}
                        placeholder="Favicon URL"
                        className="mb-2"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.ico"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "favicon");
                          }}
                        />
                        <Button variant="outline" size="sm" asChild disabled={uploadingImage === "favicon"}>
                          <span>
                            {uploadingImage === "favicon" ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Favicon
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Panel Preview Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {siteSettings.panel_preview_url ? (
                      <img src={siteSettings.panel_preview_url} alt="Panel Preview" className="h-48 w-auto rounded object-cover" />
                    ) : (
                      <div className="h-48 w-80 rounded bg-muted flex items-center justify-center">
                        <Image className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input
                        value={siteSettings.panel_preview_url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, panel_preview_url: e.target.value })}
                        placeholder="Panel Preview URL"
                      />
                      <label className="cursor-pointer inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "panel_preview");
                          }}
                        />
                        <Button variant="outline" size="sm" asChild disabled={uploadingImage === "panel_preview"}>
                          <span>
                            {uploadingImage === "panel_preview" ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Panel Preview
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Banner Settings */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Featured Banner (Homepage)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This banner appears below the hero section and showcases the plan marked as "Popular".
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Banner Badge Text</label>
                      <Input
                        value={siteSettings.featured_banner_title}
                        onChange={(e) => setSiteSettings({ ...siteSettings, featured_banner_title: e.target.value })}
                        placeholder="UPDATE AVAILABLE"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Small badge text above the title</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Banner Title</label>
                      <Input
                        value={siteSettings.featured_banner_subtitle}
                        onChange={(e) => setSiteSettings({ ...siteSettings, featured_banner_subtitle: e.target.value })}
                        placeholder="Featured Server"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Main heading of the banner</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {siteSettings.featured_banner_image_url ? (
                      <img src={siteSettings.featured_banner_image_url} alt="Featured Banner" className="h-32 w-auto rounded object-contain" />
                    ) : (
                      <div className="h-32 w-32 rounded bg-muted flex items-center justify-center">
                        <Image className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input
                        value={siteSettings.featured_banner_image_url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, featured_banner_image_url: e.target.value })}
                        placeholder="Featured Banner Image URL (optional)"
                      />
                      <label className="cursor-pointer inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "featured_banner");
                          }}
                        />
                        <Button variant="outline" size="sm" asChild disabled={uploadingImage === "featured_banner"}>
                          <span>
                            {uploadingImage === "featured_banner" ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Banner Image
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground">If no image is set, the popular plan's image will be used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Section Settings */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Features Section (Homepage)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Section Subtitle</label>
                    <Input
                      value={siteSettings.features_section_subtitle}
                      onChange={(e) => setSiteSettings({ ...siteSettings, features_section_subtitle: e.target.value })}
                      placeholder="Advanced tools to manage, customize, and create your server"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {siteSettings.features_section_logo_url ? (
                      <img src={siteSettings.features_section_logo_url} alt="Features Logo" className="h-20 w-20 rounded object-contain" />
                    ) : (
                      <div className="h-20 w-20 rounded bg-muted flex items-center justify-center">
                        <Image className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input
                        value={siteSettings.features_section_logo_url}
                        onChange={(e) => setSiteSettings({ ...siteSettings, features_section_logo_url: e.target.value })}
                        placeholder="Center Logo URL (optional)"
                      />
                      <label className="cursor-pointer inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "features_section_logo");
                          }}
                        />
                        <Button variant="outline" size="sm" asChild disabled={uploadingImage === "features_section_logo"}>
                          <span>
                            {uploadingImage === "features_section_logo" ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground">Logo displayed in the center of the features grid</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hosting Page Hero Images */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Hosting Page Hero Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Upload hero images for each hosting category page. These images appear in the hero section.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Game Hosting Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-primary" />
                        Game Hosting Hero
                      </label>
                      <div className="flex items-center gap-4">
                        {siteSettings.game_hero_image_url ? (
                          <img src={siteSettings.game_hero_image_url} alt="Game Hero" className="h-20 w-20 rounded object-contain bg-muted" />
                        ) : (
                          <div className="h-20 w-20 rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <Input
                            value={siteSettings.game_hero_image_url}
                            onChange={(e) => setSiteSettings({ ...siteSettings, game_hero_image_url: e.target.value })}
                            placeholder="Image URL"
                          />
                          <label className="cursor-pointer inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, "game_hero");
                              }}
                            />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "game_hero"}>
                              <span>
                                {uploadingImage === "game_hero" ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4 mr-2" />
                                )}
                                Upload
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* VPS Hosting Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-primary" />
                        VPS Hosting Hero
                      </label>
                      <div className="flex items-center gap-4">
                        {siteSettings.vps_hero_image_url ? (
                          <img src={siteSettings.vps_hero_image_url} alt="VPS Hero" className="h-20 w-20 rounded object-contain bg-muted" />
                        ) : (
                          <div className="h-20 w-20 rounded bg-muted flex items-center justify-center">
                            <Cloud className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <Input
                            value={siteSettings.vps_hero_image_url}
                            onChange={(e) => setSiteSettings({ ...siteSettings, vps_hero_image_url: e.target.value })}
                            placeholder="Image URL"
                          />
                          <label className="cursor-pointer inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, "vps_hero");
                              }}
                            />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "vps_hero"}>
                              <span>
                                {uploadingImage === "vps_hero" ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4 mr-2" />
                                )}
                                Upload
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Web Hosting Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Web Hosting Hero
                      </label>
                      <div className="flex items-center gap-4">
                        {siteSettings.web_hero_image_url ? (
                          <img src={siteSettings.web_hero_image_url} alt="Web Hero" className="h-20 w-20 rounded object-contain bg-muted" />
                        ) : (
                          <div className="h-20 w-20 rounded bg-muted flex items-center justify-center">
                            <Globe className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <Input
                            value={siteSettings.web_hero_image_url}
                            onChange={(e) => setSiteSettings({ ...siteSettings, web_hero_image_url: e.target.value })}
                            placeholder="Image URL"
                          />
                          <label className="cursor-pointer inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, "web_hero");
                              }}
                            />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "web_hero"}>
                              <span>
                                {uploadingImage === "web_hero" ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4 mr-2" />
                                )}
                                Upload
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Bot Hosting Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        Bot Hosting Hero
                      </label>
                      <div className="flex items-center gap-4">
                        {siteSettings.bot_hero_image_url ? (
                          <img src={siteSettings.bot_hero_image_url} alt="Bot Hero" className="h-20 w-20 rounded object-contain bg-muted" />
                        ) : (
                          <div className="h-20 w-20 rounded bg-muted flex items-center justify-center">
                            <Bot className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <Input
                            value={siteSettings.bot_hero_image_url}
                            onChange={(e) => setSiteSettings({ ...siteSettings, bot_hero_image_url: e.target.value })}
                            placeholder="Image URL"
                          />
                          <label className="cursor-pointer inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, "bot_hero");
                              }}
                            />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "bot_hero"}>
                              <span>
                                {uploadingImage === "bot_hero" ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4 mr-2" />
                                )}
                                Upload
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Game-Specific Hero Images */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Game-Specific Hero Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Upload hero images for each game type. These appear on individual game hosting pages.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Minecraft Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-green-500" />
                        Minecraft
                      </label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.minecraft_hero_image_url ? (
                          <img src={siteSettings.minecraft_hero_image_url} alt="Minecraft Hero" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.minecraft_hero_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, minecraft_hero_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "minecraft_hero");
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "minecraft_hero"}>
                            <span>
                              {uploadingImage === "minecraft_hero" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Hytale Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-purple-500" />
                        Hytale
                      </label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.hytale_hero_image_url ? (
                          <img src={siteSettings.hytale_hero_image_url} alt="Hytale Hero" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.hytale_hero_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hytale_hero_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "hytale_hero");
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "hytale_hero"}>
                            <span>
                              {uploadingImage === "hytale_hero" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Terraria Hero */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-yellow-500" />
                        Terraria
                      </label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.terraria_hero_image_url ? (
                          <img src={siteSettings.terraria_hero_image_url} alt="Terraria Hero" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.terraria_hero_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, terraria_hero_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "terraria_hero");
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "terraria_hero"}>
                            <span>
                              {uploadingImage === "terraria_hero" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Game Category Card Images */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Game Category Card Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    These images appear on the game selection cards in /game-servers page.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Minecraft Card */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-green-500" />
                        Minecraft Card
                      </label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.minecraft_card_image_url ? (
                          <img src={siteSettings.minecraft_card_image_url} alt="Minecraft Card" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.minecraft_card_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, minecraft_card_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "minecraft_card");
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "minecraft_card"}>
                            <span>
                              {uploadingImage === "minecraft_card" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Hytale Card */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-purple-500" />
                        Hytale Card
                      </label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.hytale_card_image_url ? (
                          <img src={siteSettings.hytale_card_image_url} alt="Hytale Card" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.hytale_card_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hytale_card_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "hytale_card");
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "hytale_card"}>
                            <span>
                              {uploadingImage === "hytale_card" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Terraria Card */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-yellow-500" />
                        Terraria Card
                      </label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.terraria_card_image_url ? (
                          <img src={siteSettings.terraria_card_image_url} alt="Terraria Card" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.terraria_card_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, terraria_card_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "terraria_card");
                            }}
                          />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "terraria_card"}>
                            <span>
                              {uploadingImage === "terraria_card" ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4 mr-2" />
                              )}
                              Upload
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Minecraft Subtype Card Images */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Minecraft Edition Card Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    These images appear on the edition selection cards in /game-servers/minecraft page.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Java Edition */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Java Edition</label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.minecraft_java_card_image_url ? (
                          <img src={siteSettings.minecraft_java_card_image_url} alt="Java Edition" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.minecraft_java_card_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, minecraft_java_card_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "minecraft_java_card"); }} />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "minecraft_java_card"}>
                            <span>{uploadingImage === "minecraft_java_card" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Upload</span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Bedrock Edition */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Bedrock Edition</label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.minecraft_bedrock_card_image_url ? (
                          <img src={siteSettings.minecraft_bedrock_card_image_url} alt="Bedrock Edition" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.minecraft_bedrock_card_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, minecraft_bedrock_card_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "minecraft_bedrock_card"); }} />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "minecraft_bedrock_card"}>
                            <span>{uploadingImage === "minecraft_bedrock_card" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Upload</span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Crossplay */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Crossplayable</label>
                      <div className="flex flex-col gap-3">
                        {siteSettings.minecraft_crossplay_card_image_url ? (
                          <img src={siteSettings.minecraft_crossplay_card_image_url} alt="Crossplayable" className="h-24 w-full rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-24 w-full rounded bg-muted flex items-center justify-center">
                            <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          value={siteSettings.minecraft_crossplay_card_image_url}
                          onChange={(e) => setSiteSettings({ ...siteSettings, minecraft_crossplay_card_image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer inline-block">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "minecraft_crossplay_card"); }} />
                          <Button variant="outline" size="sm" asChild disabled={uploadingImage === "minecraft_crossplay_card"}>
                            <span>{uploadingImage === "minecraft_crossplay_card" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Upload</span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hytale & Terraria Subtype Card Images */}
              <Card className="bg-card/50 border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Hytale & Terraria Tier Card Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    These images appear on the tier selection cards (Budget/Premium) in game pages.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hytale Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-purple-400">Hytale Tiers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Budget</label>
                          {siteSettings.hytale_budget_card_image_url ? (
                            <img src={siteSettings.hytale_budget_card_image_url} alt="Hytale Budget" className="h-16 w-full rounded object-cover bg-muted" />
                          ) : (
                            <div className="h-16 w-full rounded bg-muted flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-muted-foreground" /></div>
                          )}
                          <Input value={siteSettings.hytale_budget_card_image_url} onChange={(e) => setSiteSettings({ ...siteSettings, hytale_budget_card_image_url: e.target.value })} placeholder="URL" className="text-xs" />
                          <label className="cursor-pointer inline-block">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "hytale_budget_card"); }} />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "hytale_budget_card"}>
                              <span className="text-xs">{uploadingImage === "hytale_budget_card" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}Upload</span>
                            </Button>
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Premium</label>
                          {siteSettings.hytale_premium_card_image_url ? (
                            <img src={siteSettings.hytale_premium_card_image_url} alt="Hytale Premium" className="h-16 w-full rounded object-cover bg-muted" />
                          ) : (
                            <div className="h-16 w-full rounded bg-muted flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-muted-foreground" /></div>
                          )}
                          <Input value={siteSettings.hytale_premium_card_image_url} onChange={(e) => setSiteSettings({ ...siteSettings, hytale_premium_card_image_url: e.target.value })} placeholder="URL" className="text-xs" />
                          <label className="cursor-pointer inline-block">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "hytale_premium_card"); }} />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "hytale_premium_card"}>
                              <span className="text-xs">{uploadingImage === "hytale_premium_card" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}Upload</span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Terraria Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-yellow-400">Terraria Tiers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Budget</label>
                          {siteSettings.terraria_budget_card_image_url ? (
                            <img src={siteSettings.terraria_budget_card_image_url} alt="Terraria Budget" className="h-16 w-full rounded object-cover bg-muted" />
                          ) : (
                            <div className="h-16 w-full rounded bg-muted flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-muted-foreground" /></div>
                          )}
                          <Input value={siteSettings.terraria_budget_card_image_url} onChange={(e) => setSiteSettings({ ...siteSettings, terraria_budget_card_image_url: e.target.value })} placeholder="URL" className="text-xs" />
                          <label className="cursor-pointer inline-block">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "terraria_budget_card"); }} />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "terraria_budget_card"}>
                              <span className="text-xs">{uploadingImage === "terraria_budget_card" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}Upload</span>
                            </Button>
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Premium</label>
                          {siteSettings.terraria_premium_card_image_url ? (
                            <img src={siteSettings.terraria_premium_card_image_url} alt="Terraria Premium" className="h-16 w-full rounded object-cover bg-muted" />
                          ) : (
                            <div className="h-16 w-full rounded bg-muted flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-muted-foreground" /></div>
                          )}
                          <Input value={siteSettings.terraria_premium_card_image_url} onChange={(e) => setSiteSettings({ ...siteSettings, terraria_premium_card_image_url: e.target.value })} placeholder="URL" className="text-xs" />
                          <label className="cursor-pointer inline-block">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "terraria_premium_card"); }} />
                            <Button variant="outline" size="sm" asChild disabled={uploadingImage === "terraria_premium_card"}>
                              <span className="text-xs">{uploadingImage === "terraria_premium_card" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}Upload</span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={savingSettings}>
                {savingSettings ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "plan" && (editingPlan?.id ? "Edit Plan" : "Create New Plan")}
              {dialogType === "faq" && (editingFaq?.id ? "Edit FAQ" : "Create New FAQ")}
              {dialogType === "social" && (editingSocialLink?.id ? "Edit Social Link" : "Create New Social Link")}
              {dialogType === "feature" && (editingFeature?.id ? "Edit Feature" : "Create New Feature")}
            </DialogTitle>
          </DialogHeader>

          {/* Plan Dialog */}
          {dialogType === "plan" && editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Plan Name</label>
                  <Input value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} placeholder="e.g., Starter" />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={editingPlan.category}
                    onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value as Category, game_type: e.target.value !== "game" ? "" : editingPlan.game_type })}
                    disabled={!!editingPlan.id}
                  >
                    <option value="game">Game Hosting</option>
                    <option value="vps">Cloud VPS</option>
                    <option value="web">Web Hosting</option>
                    <option value="bot">Bot Hosting</option>
                  </select>
                </div>
              </div>

              {/* Game Type Selection - Only show for Game Hosting */}
              {editingPlan.category === "game" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Game Type</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={editingPlan.game_type || ""}
                      onChange={(e) => setEditingPlan({ ...editingPlan, game_type: e.target.value, game_subtype: "" })}
                    >
                      <option value="">Select a game...</option>
                      <option value="minecraft">Minecraft</option>
                      <option value="hytale">Hytale</option>
                      <option value="terraria">Terraria</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Game Subtype</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={editingPlan.game_subtype || ""}
                      onChange={(e) => setEditingPlan({ ...editingPlan, game_subtype: e.target.value })}
                      disabled={!editingPlan.game_type}
                    >
                      <option value="">Select subtype...</option>
                      {editingPlan.game_type === "minecraft" && (
                        <>
                          <option value="java">Java Edition</option>
                          <option value="bedrock">Bedrock Edition</option>
                          <option value="crossplay">Crossplayable</option>
                        </>
                      )}
                      {(editingPlan.game_type === "hytale" || editingPlan.game_type === "terraria") && (
                        <>
                          <option value="budget">Budget</option>
                          <option value="premium">Premium</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input type="number" step="0.01" value={editingPlan.price} onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Billing Cycle</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={editingPlan.billing_cycle} onChange={(e) => setEditingPlan({ ...editingPlan, billing_cycle: e.target.value })}>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input type="number" value={editingPlan.sort_order} onChange={(e) => setEditingPlan({ ...editingPlan, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">RAM</label>
                  <Input value={editingPlan.ram} onChange={(e) => setEditingPlan({ ...editingPlan, ram: e.target.value })} placeholder="e.g., 2GB" />
                </div>
                <div>
                  <label className="text-sm font-medium">CPU</label>
                  <Input value={editingPlan.cpu} onChange={(e) => setEditingPlan({ ...editingPlan, cpu: e.target.value })} placeholder="e.g., 2 vCores" />
                </div>
                <div>
                  <label className="text-sm font-medium">Storage</label>
                  <Input value={editingPlan.storage} onChange={(e) => setEditingPlan({ ...editingPlan, storage: e.target.value })} placeholder="e.g., 20GB SSD" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bandwidth</label>
                  <Input value={editingPlan.bandwidth} onChange={(e) => setEditingPlan({ ...editingPlan, bandwidth: e.target.value })} placeholder="e.g., Unlimited" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Redirect URL</label>
                <Input value={editingPlan.redirect_url} onChange={(e) => setEditingPlan({ ...editingPlan, redirect_url: e.target.value })} placeholder="https://billing.kinetichost.space/..." />
              </div>

              <div>
                <label className="text-sm font-medium">Plan Image</label>
                <div className="flex items-center gap-4 mt-2">
                  {editingPlan.image_url ? (
                    <img src={editingPlan.image_url} alt="Plan" className="h-20 w-32 object-cover rounded" />
                  ) : (
                    <div className="h-20 w-32 rounded bg-muted flex items-center justify-center">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input value={editingPlan.image_url || ""} onChange={(e) => setEditingPlan({ ...editingPlan, image_url: e.target.value })} placeholder="Image URL" />
                    <label className="cursor-pointer inline-block">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, "plan", editingPlan.id); }} />
                      <Button variant="outline" size="sm" asChild disabled={uploadingImage === editingPlan.id}>
                        <span>
                          {uploadingImage === editingPlan.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                          Upload Image
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Features (one per line)</label>
                <textarea className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="DDoS Protection&#10;Instant Setup&#10;24/7 Support" />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <Switch checked={editingPlan.popular} onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, popular: checked })} />
                  <span className="text-sm">Popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <Switch checked={editingPlan.enabled} onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, enabled: checked })} />
                  <span className="text-sm">Enabled</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSavePlan} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Plan
                </Button>
              </div>
            </div>
          )}

          {/* FAQ Dialog */}
          {dialogType === "faq" && editingFaq && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Question</label>
                <Input value={editingFaq.question} onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })} placeholder="Enter the FAQ question" />
              </div>
              <div>
                <label className="text-sm font-medium">Answer</label>
                <textarea className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm" value={editingFaq.answer} onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })} placeholder="Enter the FAQ answer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input type="number" value={editingFaq.sort_order} onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editingFaq.enabled} onCheckedChange={(checked) => setEditingFaq({ ...editingFaq, enabled: checked })} />
                  <span className="text-sm">Enabled</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSaveFaq} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save FAQ
                </Button>
              </div>
            </div>
          )}

          {/* Social Link Dialog */}
          {dialogType === "social" && editingSocialLink && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <Input value={editingSocialLink.platform} onChange={(e) => setEditingSocialLink({ ...editingSocialLink, platform: e.target.value })} placeholder="e.g., Discord, Twitter" />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input value={editingSocialLink.url} onChange={(e) => setEditingSocialLink({ ...editingSocialLink, url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={editingSocialLink.icon} onChange={(e) => setEditingSocialLink({ ...editingSocialLink, icon: e.target.value })}>
                  <option value="discord">Discord</option>
                  <option value="twitter">Twitter</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input type="number" value={editingSocialLink.sort_order} onChange={(e) => setEditingSocialLink({ ...editingSocialLink, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={editingSocialLink.enabled} onCheckedChange={(checked) => setEditingSocialLink({ ...editingSocialLink, enabled: checked })} />
                  <span className="text-sm">Enabled</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSaveSocialLink} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Link
                </Button>
              </div>
            </div>
          )}

          {/* Feature Dialog */}
          {dialogType === "feature" && editingFeature && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={editingFeature.title} onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })} placeholder="Enter the feature title" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm" value={editingFeature.description} onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })} placeholder="Enter the feature description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Icon</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={editingFeature.icon}
                    onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                  >
                    <option value="settings">Settings</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="book">Book</option>
                    <option value="package">Package</option>
                    <option value="save">Save</option>
                    <option value="layers">Layers</option>
                    <option value="refresh-cw">Refresh</option>
                    <option value="wrench">Wrench</option>
                    <option value="shield">Shield</option>
                    <option value="cpu">CPU</option>
                    <option value="wifi">WiFi</option>
                    <option value="map-pin">Map Pin</option>
                    <option value="headphones">Headphones</option>
                    <option value="eye">Eye</option>
                    <option value="database">Database</option>
                    <option value="cloud">Cloud</option>
                    <option value="zap">Zap</option>
                    <option value="lock">Lock</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input type="number" value={editingFeature.sort_order} onChange={(e) => setEditingFeature({ ...editingFeature, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editingFeature.enabled} onCheckedChange={(checked) => setEditingFeature({ ...editingFeature, enabled: checked })} />
                <span className="text-sm">Enabled</span>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSaveFeature} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Feature
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
