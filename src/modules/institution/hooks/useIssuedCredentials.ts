import { useEffect, useState } from "react";
import api from "../../../lib/api";

export function useIssuedCredentials() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/university/credentials/issued");
        setData(res.data.data || res.data); // Handle potential pagination structure
      } catch (err) {
        console.error("Failed to fetch issued credentials", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading };
}


