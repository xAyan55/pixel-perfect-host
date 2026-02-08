import { useState, useEffect } from "react";
import { usePterodactyl } from "@/hooks/usePterodactyl";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Settings, RefreshCw, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HostingPlan {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface PteroConfig {
  id: string;
  plan_id: string;
  node_id: number;
  nest_id: number;
  egg_id: number;
  memory: number;
  disk: number;
  cpu: number;
  databases: number;
  backups: number;
  allocations: number;
}

interface Node {
  id: number;
  attributes: {
    id: number;
    name: string;
  };
}

interface Nest {
  id: number;
  attributes: {
    id: number;
    name: string;
  };
}

interface Egg {
  id: number;
  attributes: {
    id: number;
    name: string;
  };
}

export function PterodactylConfigPanel() {
  const { listNodes, listNests, listEggs, loading } = usePterodactyl();
  const { toast } = useToast();

  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [configs, setConfigs] = useState<PteroConfig[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nests, setNests] = useState<Nest[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PteroConfig | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    plan_id: "",
    node_id: "",
    nest_id: "",
    egg_id: "",
    memory: "1024",
    disk: "10240",
    cpu: "100",
    databases: "1",
    backups: "2",
    allocations: "1",
  });

  const fetchData = async () => {
    const [plansData, configsData, nodesData, nestsData] = await Promise.all([
      supabase.from('hosting_plans').select('id, name, category, price').order('name'),
      supabase.from('plan_pterodactyl_config').select('*'),
      listNodes(),
      listNests(),
    ]);

    if (plansData.data) setPlans(plansData.data);
    if (configsData.data) setConfigs(configsData.data);
    setNodes(nodesData as Node[]);
    setNests(nestsData as Nest[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (form.nest_id) {
      listEggs(parseInt(form.nest_id)).then((data) => setEggs(data as Egg[]));
    }
  }, [form.nest_id, listEggs]);

  const resetForm = () => {
    setForm({
      plan_id: "",
      node_id: "",
      nest_id: "",
      egg_id: "",
      memory: "1024",
      disk: "10240",
      cpu: "100",
      databases: "1",
      backups: "2",
      allocations: "1",
    });
    setEditingConfig(null);
  };

  const handleEdit = (config: PteroConfig) => {
    setEditingConfig(config);
    setForm({
      plan_id: config.plan_id,
      node_id: config.node_id.toString(),
      nest_id: config.nest_id.toString(),
      egg_id: config.egg_id.toString(),
      memory: config.memory.toString(),
      disk: config.disk.toString(),
      cpu: config.cpu.toString(),
      databases: config.databases.toString(),
      backups: config.backups.toString(),
      allocations: config.allocations.toString(),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const configData = {
        plan_id: form.plan_id,
        node_id: parseInt(form.node_id),
        nest_id: parseInt(form.nest_id),
        egg_id: parseInt(form.egg_id),
        memory: parseInt(form.memory),
        disk: parseInt(form.disk),
        cpu: parseInt(form.cpu),
        databases: parseInt(form.databases),
        backups: parseInt(form.backups),
        allocations: parseInt(form.allocations),
      };

      if (editingConfig) {
        const { error } = await supabase
          .from('plan_pterodactyl_config')
          .update(configData)
          .eq('id', editingConfig.id);

        if (error) throw error;
        toast({ title: "Config updated successfully" });
      } else {
        const { error } = await supabase
          .from('plan_pterodactyl_config')
          .insert(configData);

        if (error) throw error;
        toast({ title: "Config created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save config",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (configId: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;

    try {
      const { error } = await supabase
        .from('plan_pterodactyl_config')
        .delete()
        .eq('id', configId);

      if (error) throw error;
      toast({ title: "Config deleted successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete config",
        variant: "destructive",
      });
    }
  };

  const getPlanName = (planId: string) => {
    return plans.find(p => p.id === planId)?.name || 'Unknown';
  };

  const getNodeName = (nodeId: number) => {
    return nodes.find(n => n.attributes.id === nodeId)?.attributes.name || nodeId.toString();
  };

  const getNestName = (nestId: number) => {
    return nests.find(n => n.attributes.id === nestId)?.attributes.name || nestId.toString();
  };

  const unconfiguredPlans = plans.filter(p => !configs.find(c => c.plan_id === p.id));

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Plan Pterodactyl Configurations
          </CardTitle>
          <CardDescription>
            Configure server specs for each hosting plan. Orders will use these settings for auto-provisioning.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={unconfiguredPlans.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Add Config
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingConfig ? "Edit Configuration" : "Add Configuration"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Hosting Plan</Label>
                  <Select
                    value={form.plan_id}
                    onValueChange={(value) => setForm({ ...form, plan_id: value })}
                    disabled={!!editingConfig}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {(editingConfig ? plans : unconfiguredPlans).map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} ({plan.category}) - ${plan.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Node</Label>
                  <Select
                    value={form.node_id}
                    onValueChange={(value) => setForm({ ...form, node_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((node) => (
                        <SelectItem key={node.attributes.id} value={node.attributes.id.toString()}>
                          {node.attributes.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nest</Label>
                    <Select
                      value={form.nest_id}
                      onValueChange={(value) => setForm({ ...form, nest_id: value, egg_id: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select nest" />
                      </SelectTrigger>
                      <SelectContent>
                        {nests.map((nest) => (
                          <SelectItem key={nest.attributes.id} value={nest.attributes.id.toString()}>
                            {nest.attributes.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Egg</Label>
                    <Select
                      value={form.egg_id}
                      onValueChange={(value) => setForm({ ...form, egg_id: value })}
                      disabled={!form.nest_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select egg" />
                      </SelectTrigger>
                      <SelectContent>
                        {eggs.map((egg) => (
                          <SelectItem key={egg.attributes.id} value={egg.attributes.id.toString()}>
                            {egg.attributes.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>RAM (MB)</Label>
                    <Input
                      type="number"
                      value={form.memory}
                      onChange={(e) => setForm({ ...form, memory: e.target.value })}
                      min={128}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Disk (MB)</Label>
                    <Input
                      type="number"
                      value={form.disk}
                      onChange={(e) => setForm({ ...form, disk: e.target.value })}
                      min={256}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPU (%)</Label>
                    <Input
                      type="number"
                      value={form.cpu}
                      onChange={(e) => setForm({ ...form, cpu: e.target.value })}
                      min={1}
                      max={400}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Databases</Label>
                    <Input
                      type="number"
                      value={form.databases}
                      onChange={(e) => setForm({ ...form, databases: e.target.value })}
                      min={0}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Backups</Label>
                    <Input
                      type="number"
                      value={form.backups}
                      onChange={(e) => setForm({ ...form, backups: e.target.value })}
                      min={0}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Allocations</Label>
                    <Input
                      type="number"
                      value={form.allocations}
                      onChange={(e) => setForm({ ...form, allocations: e.target.value })}
                      min={1}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={formLoading || !form.plan_id || !form.node_id || !form.nest_id || !form.egg_id}
                >
                  {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingConfig ? "Update Configuration" : "Create Configuration"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Node</TableHead>
                <TableHead>Nest</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Disk</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No configurations yet. Add one to enable auto-provisioning.
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{getPlanName(config.plan_id)}</TableCell>
                    <TableCell>{getNodeName(config.node_id)}</TableCell>
                    <TableCell>{getNestName(config.nest_id)}</TableCell>
                    <TableCell>{config.memory}MB</TableCell>
                    <TableCell>{config.disk}MB</TableCell>
                    <TableCell>{config.cpu}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(config)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(config.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {unconfiguredPlans.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>{unconfiguredPlans.length}</strong> plans without configuration:{" "}
              {unconfiguredPlans.map(p => p.name).join(", ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
