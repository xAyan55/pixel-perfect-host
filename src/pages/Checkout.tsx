import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/hooks/useOrders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Server, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

interface Plan {
  id: string;
  name: string;
  price: number;
  ram: string;
  cpu: string;
  storage: string;
  category: string;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { createOrder, loading: orderLoading } = useOrders();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [serverName, setServerName] = useState("");
  const [billingCycle, setBillingCycle] = useState<'month' | 'quarter' | 'year'>('month');
  const [loadingPlan, setLoadingPlan] = useState(true);

  const planId = searchParams.get('plan');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/checkout' + (planId ? `?plan=${planId}` : ''));
    }
  }, [user, authLoading, navigate, planId]);

  useEffect(() => {
    async function fetchPlan() {
      if (!planId) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('hosting_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error || !data) {
        navigate('/');
        return;
      }

      setPlan(data);
      setLoadingPlan(false);
    }

    fetchPlan();
  }, [planId, navigate]);

  const calculatePrice = (): string => {
    if (!plan) return "0";
    const basePrice = plan.price;
    
    if (billingCycle === 'quarter') {
      return (basePrice * 3 * 0.9).toFixed(2); // 10% discount
    } else if (billingCycle === 'year') {
      return (basePrice * 12 * 0.8).toFixed(2); // 20% discount
    }
    return basePrice.toFixed(2);
  };

  const getMonthlyEquivalent = (): string => {
    if (!plan) return "0";
    const total = parseFloat(calculatePrice());
    
    if (billingCycle === 'quarter') {
      return (total / 3).toFixed(2);
    } else if (billingCycle === 'year') {
      return (total / 12).toFixed(2);
    }
    return total.toFixed(2);
  };

  const handleCheckout = async () => {
    if (!plan || !serverName.trim()) return;

    try {
      const result = await createOrder({
        planId: plan.id,
        serverName: serverName.trim(),
        billingCycle,
      });

      if (result?.approveUrl) {
        window.location.href = result.approveUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (authLoading || loadingPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <>
      <SEOHead 
        title="Checkout | KineticHost"
        description="Complete your order and get your server instantly."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-24">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Order Form */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Complete Your Order</h1>
                <p className="text-muted-foreground mt-2">
                  You're just one step away from your new server
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    Server Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Server Name</Label>
                    <Input
                      id="serverName"
                      placeholder="My Awesome Server"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be the name displayed in your control panel
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Cycle</CardTitle>
                  <CardDescription>
                    Save more with longer billing periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={billingCycle}
                    onValueChange={(value) => setBillingCycle(value as 'month' | 'quarter' | 'year')}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="month" id="month" />
                        <Label htmlFor="month" className="cursor-pointer">Monthly</Label>
                      </div>
                      <span className="font-medium">${plan.price.toFixed(2)}/mo</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="quarter" id="quarter" />
                        <Label htmlFor="quarter" className="cursor-pointer">
                          Quarterly
                          <span className="ml-2 text-xs text-primary font-medium">Save 10%</span>
                        </Label>
                      </div>
                      <span className="font-medium">${(plan.price * 3 * 0.9).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border border-primary bg-primary/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="year" id="year" />
                        <Label htmlFor="year" className="cursor-pointer">
                          Annual
                          <span className="ml-2 text-xs text-primary font-medium">Save 20%</span>
                        </Label>
                      </div>
                      <span className="font-medium">${(plan.price * 12 * 0.8).toFixed(2)}</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>RAM: {plan.ram}</p>
                      <p>CPU: {plan.cpu}</p>
                      <p>Storage: {plan.storage}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Price</span>
                      <span>${plan.price.toFixed(2)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billing Cycle</span>
                      <span className="capitalize">{billingCycle}</span>
                    </div>
                    {billingCycle !== 'month' && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>-{billingCycle === 'quarter' ? '10%' : '20%'}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Due Today</p>
                        <p className="text-3xl font-bold">${calculatePrice()}</p>
                      </div>
                      {billingCycle !== 'month' && (
                        <p className="text-sm text-muted-foreground">
                          ${getMonthlyEquivalent()}/mo
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={orderLoading || !serverName.trim()}
                  >
                    {orderLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay with PayPal
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure payment via PayPal</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-3">What happens next?</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">1.</span>
                      Complete payment via PayPal
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">2.</span>
                      Your server is automatically created
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">3.</span>
                      Access your control panel credentials
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-medium">4.</span>
                      Start playing within minutes!
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
