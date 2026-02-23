import { useState } from 'react';
import * as universityService from '../services/universityService';
import { useToast } from '../../../components/ui/toast';

export function useCredentialActions() {
  const { toast } = useToast();
  const [loadingApprove, setLoadingApprove] = useState<string | null>(null);
  const [loadingReject, setLoadingReject] = useState<string | null>(null);

  const approve = async (requestId: string, onSuccess?: () => void) => {
    try {
      setLoadingApprove(requestId);
      const result = await universityService.approveCredential(requestId);
      
      toast({
        title: 'Success',
        description: `Credential approved successfully. Hash: ${result.hash?.substring(0, 16)}...`,
        variant: 'success',
        duration: 5000
      });
      
      onSuccess?.();
      return result;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'Failed to approve credential';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'error',
        duration: 5000
      });
      throw err;
    } finally {
      setLoadingApprove(null);
    }
  };

  const reject = async (requestId: string, reason: string, onSuccess?: () => void) => {
    try {
      setLoadingReject(requestId);
      
      if (reason.length < 5) {
        throw new Error('Reason must be at least 5 characters');
      }
      
      const result = await universityService.rejectCredential(requestId, reason);
      
      toast({
        title: 'Success',
        description: 'Credential rejected successfully',
        variant: 'success',
        duration: 5000
      });
      
      onSuccess?.();
      return result;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err.message || 'Failed to reject credential';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'error',
        duration: 5000
      });
      throw err;
    } finally {
      setLoadingReject(null);
    }
  };

  return {
    approve,
    reject,
    loadingApprove,
    loadingReject
  };
}