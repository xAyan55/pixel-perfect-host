import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useOrders } from "@/hooks/useOrders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Server,
  Receipt,
  ExternalLink,
  RefreshCw,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { format, formatDistanceToNow } from "date-fns";

interface UserServer {
  id: string;
  server_name: string;
  status: string;
  panel_username: string | null;
  panel_email: string | null;
  pterodactyl_server_id: number | null;
  expires_at: string | null;
  created_at: string;
  hosting_plans: {
    id: string;
    name: string;
    price: number;
    ram: string;
    cpu: string;
    storage: string;
  };
}

interface Order {
  id: string;
  order_type: string;
  amount: number;
  billing_cycle: string;
  status: string;
  created_at: string;
  hosting_plans: {
    name: string;
  };
}

export default function Client() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { captureOrder, loading: orderLoading } = useOrders();
  const { toast } = useToast();

  const [servers, setServers] = useState<UserServer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<UserServer | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [panelCredentials, setPanelCredentials] = useState<{ username: string; password: string | null; url: string } | null>(null);

  // Handle PayPal return
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && user) {
      handlePaymentCapture(token);
    }
  }, [searchParams, user]);

  const handlePaymentCapture = async (paypalOrderId: string) => {
    try {
      const result = await captureOrder({ paypalOrderId });
      
      if (result?.success) {
        toast({
          title: "Payment Successful!",
          description: result.message,
        });

        if (result.panelPassword) {
          setPanelCredentials({
            username: result.panelUsername,
            password: result.panelPassword,
            url: result.panelUrl,
          });
        }

        // Clear the URL params
        navigate('/client', { replace: true });
        fetchData();
      }
    } catch (error) {
      console.error('Payment capture error:', error);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/client');
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [serversData, ordersData] = await Promise.all([
        supabase
          .from('user_servers')
          .select('*, hosting_plans(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('*, hosting_plans(name)')
          .order('created_at', { ascending: false }),
      ]);

      if (serversData.data) setServers(serversData.data as unknown as UserServer[]);
      if (ordersData.data) setOrders(ordersData.data as unknown as Order[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      active: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      pending: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      provisioning: { variant: "secondary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
      suspended: { variant: "destructive", icon: <AlertCircle className="w-3 h-3" /> },
      cancelled: { variant: "outline", icon: <XCircle className="w-3 h-3" /> },
      expired: { variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
      paid: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 capitalize">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  const handleRenew = (server: UserServer) => {
    navigate(`/checkout?plan=${server.hosting_plans.id}&type=renew&server=${server.id}`);
  };

  const handleUpgrade = (server: UserServer) => {
    // Navigate to a plan selection page filtered to higher tier plans
    navigate(`/game-hosting?upgrade=${server.id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Client Area | KineticHost"
        description="Manage your servers, view billing history, and access your control panel."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Client Area</h1>
              <p className="text-muted-foreground mt-1">
                Manage your servers and billing
              </p>
            </div>
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Panel Credentials Modal */}
          <Dialog open={!!panelCredentials} onOpenChange={() => setPanelCredentials(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>🎉 Your Server is Ready!</DialogTitle>
                <DialogDescription>
                  Here are your control panel credentials. Please save them securely!
                </DialogDescription>
              </DialogHeader>
              {panelCredentials && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Panel URL</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm">{panelCredentials.url}</code>
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(panelCredentials.url)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Username</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm">{panelCredentials.username}</code>
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(panelCredentials.username)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {panelCredentials.password && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Password</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm">
                            {showPassword ? panelCredentials.password : '••••••••••••'}
                          </code>
                          <Button size="icon" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => copyToClipboard(panelCredentials.password!)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button className="w-full" asChild>
                    <a href={panelCredentials.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Control Panel
                    </a>
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Tabs defaultValue="servers" className="space-y-6">
            <TabsList>
              <TabsTrigger value="servers" className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                My Servers ({servers.length})
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Billing History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="servers" className="space-y-4">
              {servers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Server className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No servers yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by ordering your first server
                    </p>
                    <Button onClick={() => navigate('/game-hosting')}>
                      Browse Plans
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {servers.map((server) => (
                    <Card key={server.id}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-primary" />
                            {server.server_name}
                          </CardTitle>
                          <CardDescription>{server.hosting_plans.name}</CardDescription>
                        </div>
                        {getStatusBadge(server.status)}
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">RAM</span>
                              <span>{server.hosting_plans.ram}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">CPU</span>
                              <span>{server.hosting_plans.cpu}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Storage</span>
                              <span>{server.hosting_plans.storage}</span>
                            </div>
                            {server.expires_at && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Expires</span>
                                <span className={new Date(server.expires_at) < new Date() ? 'text-destructive' : ''}>
                                  {formatDistanceToNow(new Date(server.expires_at), { addSuffix: true })}
                                </span>
                              </div>
                            )}
                          </div>

                          {server.status === 'active' && server.panel_username && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Panel Access</h4>
                              <div className="p-3 rounded-lg bg-muted text-sm space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Username</span>
                                  <div className="flex items-center gap-1">
                                    <code>{server.panel_username}</code>
                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(server.panel_username!)}>
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                          {server.status === 'active' && (
                            <>
                              <Button size="sm" asChild>
                                <a href="https://panel.kinetichost.space" target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Open Panel
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRenew(server)}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Renew
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpgrade(server)}>
                                <ArrowUpCircle className="w-4 h-4 mr-2" />
                                Upgrade
                              </Button>
                            </>
                          )}
                          {server.status === 'expired' && (
                            <Button size="sm" onClick={() => handleRenew(server)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Renew Now
                            </Button>
                          )}
                          {server.status === 'pending' && (
                            <span className="text-sm text-muted-foreground">
                              Awaiting payment or provisioning...
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View all your past orders and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders yet
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>{order.hosting_plans.name}</TableCell>
                            <TableCell className="capitalize">{order.order_type}</TableCell>
                            <TableCell>${order.amount}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
}
