import api from "../../../lib/api";
import { useToast } from "../../../components/ui/toast";
import { useState } from 'react';

export function useUploadCredential(reload?: () => void) {
  const { toast } = useToast();
  const [progress, setProgress] = useState<number | null>(null);

  const upload = async (file: File, metadata: Record<string, any> = {}) => {
    const fd = new FormData();
    fd.append('file', file);
    Object.keys(metadata).forEach(k => {
      const v = metadata[k];
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });

    try {
      const resp = await api.post('/api/credentials/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt: ProgressEvent) => {
          if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      });
      setProgress(null);
      toast({ title: 'Credential uploaded', variant: 'success' });
      if (reload) reload();
      return resp.data;
    } catch (err: any) {
      setProgress(null);
      toast({ title: 'Upload failed', description: err?.response?.data?.error || err.message, variant: 'error' });
      throw err;
    }
  };

  return { upload, progress };
}


