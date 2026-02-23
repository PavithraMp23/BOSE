import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useToast } from "../../../components/ui/toast";

export function useJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reload = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/public/jobs");
      setJobs(res.data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const apply = async (jobId: string, title: string) => {
    await api.post(`/api/applications/apply/${jobId}`, { title });
    toast({ title: "Applied successfully!", variant: "success" });
  };

  useEffect(() => { reload(); }, []);
  return { jobs, loading, apply, reload };
}


