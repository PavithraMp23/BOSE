import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  location: string;
  verified: boolean;
  rating: number;
}

export function useCandidateSearch(filters: Record<string, any>) {
  const [data, setData] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        const res = await api.get(`${baseUrl}/api/candidates/search`, { params: filters });
        setData(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || 'Failed to search candidates');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}


