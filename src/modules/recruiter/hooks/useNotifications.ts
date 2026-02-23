import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export interface Notification { id: string; message: string; time: string; read: boolean }

export function useNotifications() {
  const [data, setData] = useState<Notification[]>([]);

  useEffect(() => {
    const load = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const res = await api.get(`${baseUrl}/api/notifications`);
      setData(res.data || []);
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    await api.post(`${baseUrl}/api/notifications/${encodeURIComponent(id)}/read`);
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return { data, markRead };
}


