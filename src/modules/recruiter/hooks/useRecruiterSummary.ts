import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export interface RecruiterSummary {
  totalJobs: number;
  openJobs: number;
  totalCandidates: number;
  verifiedCandidates: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
}

export function useRecruiterSummary() {
  const [summary, setSummary] = useState<RecruiterSummary | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, activityRes] = await Promise.all([
          api.get(`${baseUrl}/api/recruiter/summary`),
          api.get(`${baseUrl}/api/recruiter/activity`)
        ]);
        if (!isMounted) return;
        setSummary(summaryRes.data);
        setActivity(activityRes.data);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.error || 'Failed to load dashboard');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { summary, activity, loading, error };
}


