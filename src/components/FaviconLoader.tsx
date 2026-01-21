import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function FaviconLoader() {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavicon = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "favicon_url")
        .single();

      if (data?.setting_value) {
        setFaviconUrl(data.setting_value);
      }
    };

    fetchFavicon();
  }, []);

  useEffect(() => {
    if (faviconUrl) {
      // Update existing favicon link or create new one
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (link) {
        link.href = faviconUrl;
      } else {
        link = document.createElement("link");
        link.rel = "icon";
        link.href = faviconUrl;
        document.head.appendChild(link);
      }
    }
  }, [faviconUrl]);

  return null;
}
