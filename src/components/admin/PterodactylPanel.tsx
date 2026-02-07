import { useState, useEffect } from "react";
import { usePterodactyl } from "@/hooks/usePterodactyl";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Server, Users, RefreshCw } from "lucide-react";

interface User {
  id: number;
  attributes: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    root_admin: boolean;
    created_at: string;
  };
}

interface ServerData {
  id: number;
  attributes: {
    id: number;
    name: string;
    identifier: string;
    suspended: boolean;
    limits: {
      memory: number;
      disk: number;
      cpu: number;
    };
    user: number;
    node: number;
    created_at: string;
  };
}

interface Node {
  id: number;
  attributes: {
    id: number;
    name: string;
    fqdn: string;
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

interface Allocation {
  id: number;
  attributes: {
    id: number;
    ip: string;
    port: number;
    assigned: boolean;
  };
}

export function PterodactylPanel() {
  const {
    loading,
    listUsers,
    listServers,
    listNodes,
    listNests,
    listEggs,
    listAllocations,
    createUser,
    createServer,
    deleteUser,
    deleteServer,
  } = usePterodactyl();

  const [users, setUsers] = useState<User[]>([]);
  const [servers, setServers] = useState<ServerData[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nests, setNests] = useState<Nest[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createServerOpen, setCreateServerOpen] = useState(false);

  // User form state
  const [userForm, setUserForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  // Server form state
  const [serverForm, setServerForm] = useState({
    name: "",
    user_id: "",
    node_id: "",
    nest_id: "",
    egg_id: "",
    allocation_id: "",
    memory: "1024",
    disk: "10240",
    cpu: "100",
  });

  const fetchData = async () => {
    const [usersData, serversData, nodesData, nestsData] = await Promise.all([
      listUsers(),
      listServers(),
      listNodes(),
      listNests(),
    ]);
    setUsers(usersData as User[]);
    setServers(serversData as ServerData[]);
    setNodes(nodesData as Node[]);
    setNests(nestsData as Nest[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (serverForm.nest_id) {
      listEggs(parseInt(serverForm.nest_id)).then((data) => setEggs(data as Egg[]));
    }
  }, [serverForm.nest_id, listEggs]);

  useEffect(() => {
    if (serverForm.node_id) {
      listAllocations(parseInt(serverForm.node_id)).then((data) => 
        setAllocations((data as Allocation[]).filter((a) => !a.attributes.assigned))
      );
    }
  }, [serverForm.node_id, listAllocations]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(userForm);
      setCreateUserOpen(false);
      setUserForm({ email: "", username: "", first_name: "", last_name: "", password: "" });
      fetchData();
    } catch {
      // Error handled in hook
    }
  };

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createServer({
        name: serverForm.name,
        user_id: parseInt(serverForm.user_id),
        node_id: parseInt(serverForm.node_id),
        nest_id: parseInt(serverForm.nest_id),
        egg_id: parseInt(serverForm.egg_id),
        allocation_id: parseInt(serverForm.allocation_id),
        memory: parseInt(serverForm.memory),
        disk: parseInt(serverForm.disk),
        cpu: parseInt(serverForm.cpu),
      });
      setCreateServerOpen(false);
      setServerForm({
        name: "",
        user_id: "",
        node_id: "",
        nest_id: "",
        egg_id: "",
        allocation_id: "",
        memory: "1024",
        disk: "10240",
        cpu: "100",
      });
      fetchData();
    } catch {
      // Error handled in hook
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
      fetchData();
    }
  };

  const handleDeleteServer = async (serverId: number) => {
    if (confirm("Are you sure you want to delete this server?")) {
      await deleteServer(serverId);
      fetchData();
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          Pterodactyl Panel
        </CardTitle>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="servers" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Servers ({servers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Panel User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={userForm.first_name}
                          onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={userForm.last_name}
                          onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create User
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        {loading ? "Loading..." : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.attributes.id}>
                        <TableCell>{user.attributes.id}</TableCell>
                        <TableCell className="font-medium">{user.attributes.username}</TableCell>
                        <TableCell>{user.attributes.email}</TableCell>
                        <TableCell>
                          {user.attributes.first_name} {user.attributes.last_name}
                        </TableCell>
                        <TableCell>
                          {user.attributes.root_admin ? (
                            <span className="text-primary">Yes</span>
                          ) : (
                            "No"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteUser(user.attributes.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="servers" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Server
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Server</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateServer} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="server_name">Server Name</Label>
                      <Input
                        id="server_name"
                        value={serverForm.name}
                        onChange={(e) => setServerForm({ ...serverForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user_id">Owner</Label>
                      <Select
                        value={serverForm.user_id}
                        onValueChange={(value) => setServerForm({ ...serverForm, user_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.attributes.id} value={user.attributes.id.toString()}>
                              {user.attributes.username} ({user.attributes.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="node_id">Node</Label>
                      <Select
                        value={serverForm.node_id}
                        onValueChange={(value) => setServerForm({ ...serverForm, node_id: value, allocation_id: "" })}
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

                    {serverForm.node_id && (
                      <div className="space-y-2">
                        <Label htmlFor="allocation_id">Allocation (Port)</Label>
                        <Select
                          value={serverForm.allocation_id}
                          onValueChange={(value) => setServerForm({ ...serverForm, allocation_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select port" />
                          </SelectTrigger>
                          <SelectContent>
                            {allocations.map((allocation) => (
                              <SelectItem
                                key={allocation.attributes.id}
                                value={allocation.attributes.id.toString()}
                              >
                                {allocation.attributes.ip}:{allocation.attributes.port}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="nest_id">Nest</Label>
                      <Select
                        value={serverForm.nest_id}
                        onValueChange={(value) => setServerForm({ ...serverForm, nest_id: value, egg_id: "" })}
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

                    {serverForm.nest_id && (
                      <div className="space-y-2">
                        <Label htmlFor="egg_id">Egg</Label>
                        <Select
                          value={serverForm.egg_id}
                          onValueChange={(value) => setServerForm({ ...serverForm, egg_id: value })}
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
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memory">RAM (MB)</Label>
                        <Input
                          id="memory"
                          type="number"
                          value={serverForm.memory}
                          onChange={(e) => setServerForm({ ...serverForm, memory: e.target.value })}
                          required
                          min={128}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disk">Disk (MB)</Label>
                        <Input
                          id="disk"
                          type="number"
                          value={serverForm.disk}
                          onChange={(e) => setServerForm({ ...serverForm, disk: e.target.value })}
                          required
                          min={256}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpu">CPU (%)</Label>
                        <Input
                          id="cpu"
                          type="number"
                          value={serverForm.cpu}
                          onChange={(e) => setServerForm({ ...serverForm, cpu: e.target.value })}
                          required
                          min={1}
                          max={400}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !serverForm.user_id || !serverForm.node_id || !serverForm.nest_id || !serverForm.egg_id || !serverForm.allocation_id}
                    >
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Server
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        {loading ? "Loading..." : "No servers found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    servers.map((server) => (
                      <TableRow key={server.attributes.id}>
                        <TableCell>{server.attributes.id}</TableCell>
                        <TableCell className="font-medium">{server.attributes.name}</TableCell>
                        <TableCell className="font-mono text-xs">{server.attributes.identifier}</TableCell>
                        <TableCell className="text-xs">
                          {server.attributes.limits.memory}MB / {server.attributes.limits.disk}MB / {server.attributes.limits.cpu}%
                        </TableCell>
                        <TableCell>
                          {server.attributes.suspended ? (
                            <span className="text-destructive">Suspended</span>
                          ) : (
                            <span className="text-primary">Active</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteServer(server.attributes.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
