import { useState } from 'react';
import api from '../../../lib/api';

export function useCredentialLookup() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const res = await api.get(`${baseUrl}/api/candidates/${encodeURIComponent(id)}/credentials`);
      setData(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load credentials');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchCredentials };
}


