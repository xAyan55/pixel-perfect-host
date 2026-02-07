import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PterodactylUser {
  id: number;
  attributes: {
    id: number;
    external_id: string | null;
    uuid: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    language: string;
    root_admin: boolean;
    "2fa": boolean;
    created_at: string;
    updated_at: string;
  };
}

interface PterodactylServer {
  id: number;
  attributes: {
    id: number;
    external_id: string | null;
    uuid: string;
    identifier: string;
    name: string;
    description: string;
    suspended: boolean;
    limits: {
      memory: number;
      swap: number;
      disk: number;
      io: number;
      cpu: number;
    };
    user: number;
    node: number;
    allocation: number;
    nest: number;
    egg: number;
    created_at: string;
    updated_at: string;
  };
}

interface PterodactylNode {
  id: number;
  attributes: {
    id: number;
    name: string;
    description: string | null;
    location_id: number;
    fqdn: string;
    scheme: string;
    memory: number;
    memory_overallocate: number;
    disk: number;
    disk_overallocate: number;
    daemon_listen: number;
    daemon_sftp: number;
  };
}

interface PterodactylNest {
  id: number;
  attributes: {
    id: number;
    uuid: string;
    author: string;
    name: string;
    description: string | null;
  };
}

interface PterodactylEgg {
  id: number;
  attributes: {
    id: number;
    uuid: string;
    name: string;
    nest: number;
    author: string;
    description: string | null;
    docker_image: string;
    startup: string;
  };
}

interface PterodactylAllocation {
  id: number;
  attributes: {
    id: number;
    ip: string;
    alias: string | null;
    port: number;
    assigned: boolean;
  };
}

export function usePterodactyl() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const callPterodactyl = useCallback(async (payload: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pterodactyl`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }
    
    return data;
  }, []);

  const listUsers = useCallback(async (): Promise<PterodactylUser[]> => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "list_users" });
      return data.data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list users",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const listServers = useCallback(async (): Promise<PterodactylServer[]> => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "list_servers" });
      return data.data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list servers",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const listNodes = useCallback(async (): Promise<PterodactylNode[]> => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "list_nodes" });
      return data.data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list nodes",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const listNests = useCallback(async (): Promise<PterodactylNest[]> => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "list_nests" });
      return data.data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list nests",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const listEggs = useCallback(async (nestId: number): Promise<PterodactylEgg[]> => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "list_eggs", nest_id: nestId });
      return data.data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list eggs",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const listAllocations = useCallback(async (nodeId: number): Promise<PterodactylAllocation[]> => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "list_allocations", node_id: nodeId });
      return data.data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to list allocations",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const createUser = useCallback(async (userData: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "create_user", ...userData });
      toast({
        title: "Success",
        description: "User created successfully",
      });
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const createServer = useCallback(async (serverData: {
    name: string;
    user_id: number;
    egg_id: number;
    nest_id: number;
    node_id: number;
    allocation_id: number;
    memory: number;
    disk: number;
    cpu: number;
    databases?: number;
    backups?: number;
  }) => {
    setLoading(true);
    try {
      const data = await callPterodactyl({ action: "create_server", ...serverData });
      toast({
        title: "Success",
        description: "Server created successfully",
      });
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create server",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const deleteUser = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      await callPterodactyl({ action: "delete_user", id: userId });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  const deleteServer = useCallback(async (serverId: number) => {
    setLoading(true);
    try {
      await callPterodactyl({ action: "delete_server", id: serverId });
      toast({
        title: "Success",
        description: "Server deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete server",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callPterodactyl, toast]);

  return {
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
  };
}
