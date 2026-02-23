import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useToast } from '../../../components/ui/toast';

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  appliedAt: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  resumeURL?: string;
}

export function useApplicants(jobId?: string) {
  const [data, setData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!jobId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        const res = await api.get(`${baseUrl}/api/applicants/${encodeURIComponent(jobId)}`);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        const message = err?.response?.data?.error || err?.message || 'Failed to load applicants';
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const updateStatus = async (id: string, status: Applicant['status']) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const res = await api.post(`${baseUrl}/api/applicants/${encodeURIComponent(id)}/status`, { status });
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, status: res.data.status } : a)));
      toast({ title: 'Status updated', description: `Applicant ${status}`, variant: 'success' });
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.response?.data?.error || 'Please try again', variant: 'error' });
    }
  };

  return { data, loading, error, updateStatus };
}


