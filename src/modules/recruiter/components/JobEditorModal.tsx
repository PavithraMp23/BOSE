import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import type { Job } from '../hooks/useJobs';

interface JobEditorModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<Job> | null;
  onSubmit: (values: Partial<Job>) => Promise<void> | void;
}

export default function JobEditorModal({ open, onOpenChange, initial, onSubmit }: JobEditorModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Job['status']>('draft');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string; location?: string; status?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setStatus((initial?.status as Job['status']) || 'draft');
    setLocation(initial?.location || '');
  }, [initial, open]);

  const handleSubmit = async () => {
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!description.trim()) nextErrors.description = 'Description is required';
    if (!location.trim()) nextErrors.location = 'Location is required';
    if (!status) nextErrors.status = 'Status is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      setSubmitting(true);
      await onSubmit({ title: title.trim(), description: description.trim(), location: location.trim(), status });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial?.id ? 'Edit Job' : 'Post Job'}</DialogTitle>
          <DialogDescription>Provide job details and status.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Frontend Engineer" />
            {errors.title && <div className="mt-1 text-xs text-red-600 font-semibold">{errors.title}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short summary" />
            {errors.description && <div className="mt-1 text-xs text-red-600 font-semibold">{errors.description}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Remote or City" />
            {errors.location && <div className="mt-1 text-xs text-red-600 font-semibold">{errors.location}</div>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-lg border-2 border-slate-300 px-3 py-2 text-sm text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as Job['status'])}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && <div className="mt-1 text-xs text-red-600 font-semibold">{errors.status}</div>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


