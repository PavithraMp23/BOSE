import { useState } from 'react';
import axios from 'axios';

interface TransactionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useFabricTx() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitTransaction = async (
    endpoint: string,
    payload: any
  ): Promise<TransactionResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/${endpoint}`,
        payload
      );

      setLoading(false);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Transaction failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const evaluateTransaction = async (
    endpoint: string,
    params?: any
  ): Promise<TransactionResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/${endpoint}`,
        { params }
      );

      setLoading(false);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Query failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    submitTransaction,
    evaluateTransaction,
    loading,
    error,
    clearError: () => setError(null)
  };
}