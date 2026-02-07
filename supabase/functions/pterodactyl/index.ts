import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserPayload {
  action: "create_user";
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

interface CreateServerPayload {
  action: "create_server";
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
  startup?: string;
  environment?: Record<string, string>;
}

interface ListPayload {
  action: "list_users" | "list_servers" | "list_nodes" | "list_eggs" | "list_nests" | "list_allocations";
  node_id?: number;
  nest_id?: number;
}

interface DeletePayload {
  action: "delete_user" | "delete_server";
  id: number;
}

type Payload = CreateUserPayload | CreateServerPayload | ListPayload | DeletePayload;

async function pterodactylRequest(
  endpoint: string,
  method: string = "GET",
  body?: unknown
): Promise<Response> {
  const PTERODACTYL_URL = Deno.env.get("PTERODACTYL_URL");
  const PTERODACTYL_API_KEY = Deno.env.get("PTERODACTYL_API_KEY");

  if (!PTERODACTYL_URL) {
    throw new Error("PTERODACTYL_URL is not configured");
  }
  if (!PTERODACTYL_API_KEY) {
    throw new Error("PTERODACTYL_API_KEY is not configured");
  }

  const url = `${PTERODACTYL_URL}/api/application${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${PTERODACTYL_API_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", claimsData.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: Payload = await req.json();

    switch (payload.action) {
      case "list_users": {
        const response = await pterodactylRequest("/users");
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_servers": {
        const response = await pterodactylRequest("/servers");
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_nodes": {
        const response = await pterodactylRequest("/nodes");
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_nests": {
        const response = await pterodactylRequest("/nests");
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_eggs": {
        const nestId = (payload as ListPayload).nest_id;
        if (!nestId) {
          return new Response(
            JSON.stringify({ error: "nest_id is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const response = await pterodactylRequest(`/nests/${nestId}/eggs`);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_allocations": {
        const nodeId = (payload as ListPayload).node_id;
        if (!nodeId) {
          return new Response(
            JSON.stringify({ error: "node_id is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const response = await pterodactylRequest(`/nodes/${nodeId}/allocations`);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_user": {
        const { email, username, first_name, last_name, password } = payload as CreateUserPayload;
        const response = await pterodactylRequest("/users", "POST", {
          email,
          username,
          first_name,
          last_name,
          password,
        });
        const data = await response.json();
        
        if (!response.ok) {
          return new Response(JSON.stringify({ error: data.errors || "Failed to create user" }), {
            status: response.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_server": {
        const serverPayload = payload as CreateServerPayload;
        
        // Default Minecraft startup command if not provided
        const startup = serverPayload.startup || "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}";
        
        const response = await pterodactylRequest("/servers", "POST", {
          name: serverPayload.name,
          user: serverPayload.user_id,
          egg: serverPayload.egg_id,
          docker_image: "ghcr.io/pterodactyl/yolks:java_17",
          startup,
          environment: serverPayload.environment || {
            SERVER_JARFILE: "server.jar",
            VANILLA_VERSION: "latest",
          },
          limits: {
            memory: serverPayload.memory,
            swap: 0,
            disk: serverPayload.disk,
            io: 500,
            cpu: serverPayload.cpu,
          },
          feature_limits: {
            databases: serverPayload.databases || 0,
            backups: serverPayload.backups || 1,
            allocations: 1,
          },
          allocation: {
            default: serverPayload.allocation_id,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          return new Response(JSON.stringify({ error: data.errors || "Failed to create server" }), {
            status: response.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_user": {
        const { id } = payload as DeletePayload;
        const response = await pterodactylRequest(`/users/${id}`, "DELETE");
        
        if (!response.ok) {
          const data = await response.json();
          return new Response(JSON.stringify({ error: data.errors || "Failed to delete user" }), {
            status: response.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_server": {
        const { id } = payload as DeletePayload;
        const response = await pterodactylRequest(`/servers/${id}`, "DELETE");
        
        if (!response.ok) {
          const data = await response.json();
          return new Response(JSON.stringify({ error: data.errors || "Failed to delete server" }), {
            status: response.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Pterodactyl API error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
