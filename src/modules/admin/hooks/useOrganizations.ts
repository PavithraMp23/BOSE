import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ui/toast";

export interface Org { id: string; name: string; approved: boolean; }

export function useOrganizations() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.get("/api/admin/orgs");
      setOrgs(res.data);
      setLoading(false);
    })();
  }, []);

  const approveOrg = async (id: string) => {
    await api.post(`/api/admin/orgs/${id}/approve`);
    setOrgs(prev => prev.map(o => (o.id === id ? { ...o, approved: true } : o)));
    toast({ title: "Organization approved", variant: "success" });
  };

  return { orgs, loading, approveOrg };
}


