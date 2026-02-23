import { useEffect, useState } from "react";
import api from "../../../lib/api";

export function useApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    const res = await api.get("/api/applications/my");
    setApps(res.data);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);
  return { apps, loading, reload };
}


