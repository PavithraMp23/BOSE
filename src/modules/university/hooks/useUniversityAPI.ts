import { useState, useEffect } from 'react';
import * as universityService from '../services/universityService';
import { useAuth } from '../../../contexts/AuthContext';

export function useVerificationRequests(page: number = 1, limit: number = 10, status?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await universityService.getVerificationRequests(page, limit, status, user?.role);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to fetch verification requests');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, status, user?.role]);

  return { data, loading, error };
}

export function useIssuedCredentials(page: number = 1, limit: number = 10, type?: string, startDate?: string, endDate?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await universityService.getIssuedCredentials(page, limit, type, startDate, endDate, user?.role);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to fetch issued credentials');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, type, startDate, endDate, user?.role]);

  return { data, loading, error };
}

export function useStudentSearch(page: number = 1, limit: number = 10, name?: string, email?: string, degree?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await universityService.searchStudents(page, limit, name, email, degree, user?.role);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to search students');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, name, email, degree, user?.role]);

  return { data, loading, error };
}

export function useAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await universityService.getAnalytics(user?.role);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.role]);

  return { data, loading, error };
}