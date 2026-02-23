import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ui/toast";

export function useMyCredentials() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reload = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/credentials/my");
      setData(res.data);
    } catch {
      toast({ title: "Failed to load credentials", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);
  return { data, loading, reload };
}


