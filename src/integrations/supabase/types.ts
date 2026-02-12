export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      discount_coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          discount_type: string
          discount_value: number
          enabled: boolean
          expires_at: string | null
          id: string
          max_uses: number | null
          min_order_amount: number | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value: number
          enabled?: boolean
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          enabled?: boolean
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          enabled: boolean | null
          id: string
          question: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          enabled?: boolean | null
          id?: string
          question: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          enabled?: boolean | null
          id?: string
          question?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string
          description: string
          enabled: boolean | null
          icon: string
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          enabled?: boolean | null
          icon?: string
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          enabled?: boolean | null
          icon?: string
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hosting_plans: {
        Row: {
          bandwidth: string
          billing_cycle: string
          category: Database["public"]["Enums"]["hosting_category"]
          cpu: string
          created_at: string
          enabled: boolean | null
          features: string[]
          game_subtype: string | null
          game_type: string | null
          id: string
          image_url: string | null
          name: string
          popular: boolean | null
          price: number
          ram: string
          redirect_url: string
          sort_order: number | null
          storage: string
          updated_at: string
        }
        Insert: {
          bandwidth: string
          billing_cycle?: string
          category: Database["public"]["Enums"]["hosting_category"]
          cpu: string
          created_at?: string
          enabled?: boolean | null
          features?: string[]
          game_subtype?: string | null
          game_type?: string | null
          id?: string
          image_url?: string | null
          name: string
          popular?: boolean | null
          price: number
          ram: string
          redirect_url: string
          sort_order?: number | null
          storage: string
          updated_at?: string
        }
        Update: {
          bandwidth?: string
          billing_cycle?: string
          category?: Database["public"]["Enums"]["hosting_category"]
          cpu?: string
          created_at?: string
          enabled?: boolean | null
          features?: string[]
          game_subtype?: string | null
          game_type?: string | null
          id?: string
          image_url?: string | null
          name?: string
          popular?: boolean | null
          price?: number
          ram?: string
          redirect_url?: string
          sort_order?: number | null
          storage?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          billing_cycle: string
          coupon_code: string | null
          created_at: string
          currency: string
          discount_amount: number | null
          id: string
          order_type: string
          paypal_capture_id: string | null
          paypal_order_id: string | null
          plan_id: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
          user_server_id: string | null
        }
        Insert: {
          amount: number
          billing_cycle?: string
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount_amount?: number | null
          id?: string
          order_type?: string
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          plan_id: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
          user_server_id?: string | null
        }
        Update: {
          amount?: number
          billing_cycle?: string
          coupon_code?: string | null
          created_at?: string
          currency?: string
          discount_amount?: number | null
          id?: string
          order_type?: string
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          plan_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
          user_server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_server_id_fkey"
            columns: ["user_server_id"]
            isOneToOne: false
            referencedRelation: "user_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_pterodactyl_config: {
        Row: {
          allocations: number
          backups: number
          cpu: number
          created_at: string
          databases: number
          disk: number
          egg_id: number
          id: string
          memory: number
          nest_id: number
          node_id: number
          plan_id: string
          updated_at: string
        }
        Insert: {
          allocations?: number
          backups?: number
          cpu: number
          created_at?: string
          databases?: number
          disk: number
          egg_id: number
          id?: string
          memory: number
          nest_id: number
          node_id: number
          plan_id: string
          updated_at?: string
        }
        Update: {
          allocations?: number
          backups?: number
          cpu?: number
          created_at?: string
          databases?: number
          disk?: number
          egg_id?: number
          id?: string
          memory?: number
          nest_id?: number
          node_id?: number
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_pterodactyl_config_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: true
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          enabled: boolean | null
          icon: string
          id: string
          platform: string
          sort_order: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          icon: string
          id?: string
          platform: string
          sort_order?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          icon?: string
          id?: string
          platform?: string
          sort_order?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_servers: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          panel_email: string | null
          panel_username: string | null
          plan_id: string
          pterodactyl_server_id: number | null
          pterodactyl_user_id: number | null
          server_name: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          panel_email?: string | null
          panel_username?: string | null
          plan_id: string
          pterodactyl_server_id?: number | null
          pterodactyl_user_id?: number | null
          server_name: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          panel_email?: string | null
          panel_username?: string | null
          plan_id?: string
          pterodactyl_server_id?: number | null
          pterodactyl_user_id?: number | null
          server_name?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_servers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      hosting_category: "game" | "vps" | "web" | "bot"
      order_status:
        | "pending"
        | "paid"
        | "provisioning"
        | "active"
        | "suspended"
        | "cancelled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      hosting_category: ["game", "vps", "web", "bot"],
      order_status: [
        "pending",
        "paid",
        "provisioning",
        "active",
        "suspended",
        "cancelled",
        "expired",
      ],
    },
  },
} as const
