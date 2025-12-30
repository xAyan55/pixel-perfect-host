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
  Loader2, Save, X, HardDrive, Cpu, Wifi, Settings, Upload, Image
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
}

interface SiteSettings {
  get_started_url: string;
  free_server_url: string;
  free_server_enabled: string;
  logo_url: string;
  panel_preview_url: string;
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
};

export default function Admin() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("game");
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");
  const [activeTab, setActiveTab] = useState("plans");
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    get_started_url: "",
    free_server_url: "",
    free_server_enabled: "true",
    logo_url: "",
    panel_preview_url: "",
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

  const handleCreatePlan = () => {
    setEditingPlan({ ...emptyPlan, id: "", category: activeCategory } as Plan);
    setFeaturesText("");
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFeaturesText(plan.features.join("\n"));
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
    const { error } = await supabase
      .from("hosting_plans")
      .update({ enabled: !plan.enabled })
      .eq("id", plan.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update plan" });
    } else {
      fetchPlans();
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
    type: "logo" | "panel_preview" | "plan",
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

    if (type === "logo") {
      setSiteSettings((prev) => ({ ...prev, logo_url: publicUrl }));
    } else if (type === "panel_preview") {
      setSiteSettings((prev) => ({ ...prev, panel_preview_url: publicUrl }));
    } else if (type === "plan" && editingPlan) {
      setEditingPlan({ ...editingPlan, image_url: publicUrl });
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
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="plans" className="data-[state=active]:bg-primary">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Hosting Plans
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              <Settings className="w-4 h-4 mr-2" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            {/* Category Tabs */}
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

            {/* Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{categoryNames[activeCategory]} Plans</h2>
              <Button onClick={handleCreatePlan}>
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </div>

            {/* Plans Grid */}
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
                  <Card
                    key={plan.id}
                    className={`bg-card/50 border-border/50 relative ${
                      !plan.enabled ? "opacity-60" : ""
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute top-2 right-2 bg-primary">Popular</Badge>
                    )}
                    {plan.image_url && (
                      <div className="h-32 overflow-hidden rounded-t-lg">
                        <img src={plan.image_url} alt={plan.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Switch
                          checked={plan.enabled}
                          onCheckedChange={() => handleToggleEnabled(plan)}
                        />
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

                      <div className="text-xs text-muted-foreground truncate">
                        URL: {plan.redirect_url}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditPlan(plan)}
                        >
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Button URLs */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Button URLs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Let's Get Started Button URL</label>
                    <Input
                      value={siteSettings.get_started_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, get_started_url: e.target.value })}
                      placeholder="https://billing.example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Free Server Button URL</label>
                    <Input
                      value={siteSettings.free_server_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, free_server_url: e.target.value })}
                      placeholder="https://billing.example.com/free"
                    />
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

              {/* Logo Upload */}
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

              {/* Panel Preview Upload */}
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
                      <p className="text-xs text-muted-foreground">
                        This image will be displayed in the Solutions section.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={savingSettings}>
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              {editingPlan?.id ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>

          {editingPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Plan Name</label>
                  <Input
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g., Starter"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={editingPlan.category}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, category: e.target.value as Category })
                    }
                    disabled={!!editingPlan.id}
                  >
                    <option value="game">Game Hosting</option>
                    <option value="vps">Cloud VPS</option>
                    <option value="web">Web Hosting</option>
                    <option value="bot">Bot Hosting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Billing Cycle</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={editingPlan.billing_cycle}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, billing_cycle: e.target.value })
                    }
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sort Order</label>
                  <Input
                    type="number"
                    value={editingPlan.sort_order}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, sort_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">RAM</label>
                  <Input
                    value={editingPlan.ram}
                    onChange={(e) => setEditingPlan({ ...editingPlan, ram: e.target.value })}
                    placeholder="e.g., 2GB"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">CPU</label>
                  <Input
                    value={editingPlan.cpu}
                    onChange={(e) => setEditingPlan({ ...editingPlan, cpu: e.target.value })}
                    placeholder="e.g., 2 vCores"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Storage</label>
                  <Input
                    value={editingPlan.storage}
                    onChange={(e) => setEditingPlan({ ...editingPlan, storage: e.target.value })}
                    placeholder="e.g., 20GB SSD"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bandwidth</label>
                  <Input
                    value={editingPlan.bandwidth}
                    onChange={(e) => setEditingPlan({ ...editingPlan, bandwidth: e.target.value })}
                    placeholder="e.g., Unlimited"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Redirect URL</label>
                <Input
                  value={editingPlan.redirect_url}
                  onChange={(e) => setEditingPlan({ ...editingPlan, redirect_url: e.target.value })}
                  placeholder="https://billing.kinetichost.space/..."
                />
              </div>

              {/* Plan Image Upload */}
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
                    <Input
                      value={editingPlan.image_url || ""}
                      onChange={(e) => setEditingPlan({ ...editingPlan, image_url: e.target.value })}
                      placeholder="Image URL"
                    />
                    <label className="cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "plan", editingPlan.id);
                        }}
                      />
                      <Button variant="outline" size="sm" asChild disabled={uploadingImage === editingPlan.id}>
                        <span>
                          {uploadingImage === editingPlan.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          Upload Image
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Features (one per line)</label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="DDoS Protection&#10;Instant Setup&#10;24/7 Support"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.popular}
                    onCheckedChange={(checked) =>
                      setEditingPlan({ ...editingPlan, popular: checked })
                    }
                  />
                  <span className="text-sm">Popular</span>
                </label>
                <label className="flex items-center gap-2">
                  <Switch
                    checked={editingPlan.enabled}
                    onCheckedChange={(checked) =>
                      setEditingPlan({ ...editingPlan, enabled: checked })
                    }
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSavePlan} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
