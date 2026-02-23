import { useEffect, useState } from "react";
import api from "../../../lib/api";

export function useAdminSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.get("/api/admin/summary");
      setData(res.data);
      setLoading(false);
    })();
  }, []);

  return { data, loading };
}


