import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useToast } from '../../../components/ui/toast';

interface VerificationRequest {
  _id: string;
  credentialId: string;
  requesterId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  credential?: {
    title: string;
    type: string;
    studentName: string;
    institution: string;
    attachments: Array<{ url: string }>;
  };
}

export function useVerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function loadRequests() {
    try {
      setLoading(true);
      console.log('Loading verification requests...');
      const { data } = await api.get('/api/credentials/requests');
      console.log('Verification requests response:', data);
      // Backend returns array directly, not wrapped in { requests: [] }
      const requestsArray = Array.isArray(data) ? data : (data.requests || []);
      console.log('Parsed requests:', requestsArray);
      setRequests(requestsArray);
    } catch (err: any) {
      console.error('Error loading verification requests:', err);
      toast({
        title: 'Failed to load requests',
        description: err?.response?.data?.error || err.message,
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  async function approveRequest(requestId: string) {
    try {
      await api.post(`/api/credentials/requests/${requestId}/approve`);
      toast({ title: 'Request approved', variant: 'success' });
      await loadRequests(); // refresh
    } catch (err: any) {
      toast({
        title: 'Failed to approve',
        description: err?.response?.data?.error || err.message,
        variant: 'error'
      });
    }
  }

  async function rejectRequest(requestId: string, notes?: string) {
    try {
      await api.post(`/api/credentials/requests/${requestId}/reject`, { notes });
      toast({ title: 'Request rejected', variant: 'success' });
      await loadRequests(); // refresh
    } catch (err: any) {
      toast({
        title: 'Failed to reject',
        description: err?.response?.data?.error || err.message,
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return {
    requests,
    loading,
    approveRequest,
    rejectRequest,
    refresh: loadRequests
  };
}