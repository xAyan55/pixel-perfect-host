import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateOrderParams {
  planId: string;
  serverName: string;
  billingCycle: 'month' | 'quarter' | 'year';
  orderType?: 'new' | 'renew' | 'upgrade';
  userServerId?: string;
  couponCode?: string;
}

interface CaptureOrderParams {
  paypalOrderId: string;
}

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createOrder = async (params: CreateOrderParams) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('paypal-create-order', {
        body: params,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const captureOrder = async (params: CaptureOrderParams) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('paypal-capture-order', {
        body: params,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to capture payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserServers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_servers')
        .select('*, hosting_plans(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch servers",
        variant: "destructive",
      });
      return [];
    }
  };

  const getOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, hosting_plans(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    loading,
    createOrder,
    captureOrder,
    getUserServers,
    getOrders,
  };
}
