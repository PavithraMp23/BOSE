import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export function useMessages(candidateId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!candidateId) return;
    (async () => {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const res = await api.get(`${baseUrl}/api/messages/${encodeURIComponent(candidateId)}`);
      setMessages(res.data || []);
      setLoading(false);
    })();
  }, [candidateId]);

  const sendMessage = async (text: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    const res = await api.post(`${baseUrl}/api/messages/${encodeURIComponent(candidateId || '')}`, { text });
    setMessages((prev) => [...prev, res.data]);
  };

  return { messages, loading, sendMessage };
}


