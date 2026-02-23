import { useCallback, useEffect, useState } from 'react';
import api from '../../../lib/api';

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  status: 'active' | 'closed' | 'draft';
  applicantsCount: number;
  createdAt: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${baseUrl}/api/jobs/my`);
      const list = Array.isArray(res.data) ? res.data : [];
      const normalized: Job[] = list.map((j: any) => ({
        id: j.id || j._id,
        title: j.title || '',
        location: j.location || 'Remote',
        description: j.description || '',
        status: (j.status || 'draft').toLowerCase(),
        applicantsCount: Number.isFinite(j.applicantsCount) ? j.applicantsCount : 0,
        createdAt: j.createdAt || new Date().toISOString(),
      }));
      setJobs(normalized);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = async (payload: Partial<Job>) => {
    const res = await api.post(`${baseUrl}/api/jobs`, payload);
    await fetchJobs();
    return res.data;
  };

  const updateJob = async (id: string, payload: Partial<Job>) => {
    const res = await api.put(`${baseUrl}/api/jobs/${encodeURIComponent(id)}`, payload);
    await fetchJobs();
    return res.data;
  };

  const deleteJob = async (id: string) => {
    await api.delete(`${baseUrl}/api/jobs/${encodeURIComponent(id)}`);
    await fetchJobs();
  };

  return { jobs, loading, error, fetchJobs, createJob, updateJob, deleteJob };
}


