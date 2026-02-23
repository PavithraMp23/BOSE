import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import type { Job } from '../hooks/useJobs';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const statusConfig: Record<Job['status'], { bg: string; text: string; border: string; label: string }> = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500',
    label: 'Active',
  },
  closed: {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-500',
    label: 'Closed',
  },
  draft: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-500',
    label: 'Draft',
  },
};

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const status = statusConfig[job.status] || statusConfig.draft;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="flex-row items-start justify-between pb-3">
        <CardTitle className="text-lg font-bold text-slate-800 pr-4">
          {job.title}
        </CardTitle>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${status.bg} ${status.text} ${status.border} whitespace-nowrap shadow-sm`}>
          {status.label}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="h-3.5 w-3.5" />
          <span>Created {new Date(job.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onEdit(job)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(job)}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


