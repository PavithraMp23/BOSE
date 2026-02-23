import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { AlertCircle } from 'lucide-react';

interface RejectModalProps {
  open: boolean;
  title?: string;
  studentName?: string;
  loading?: boolean;
  onReject: (reason: string) => void;
  onCancel: () => void;
}

export default function RejectModal({
  open,
  title = 'Reject Credential',
  studentName,
  loading = false,
  onReject,
  onCancel
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleReject = () => {
    setError(null);
    
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }
    
    if (reason.trim().length < 5) {
      setError('Reason must be at least 5 characters');
      return;
    }
    
    onReject(reason);
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-2">
                {studentName ? `You are rejecting the credential for ${studentName}. ` : ''}
                Please provide a detailed reason for rejection.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 5 characters)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={4}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/500 characters
            </p>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Processing...' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}