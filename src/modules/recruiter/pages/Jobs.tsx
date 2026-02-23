import React, { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useJobs, Job } from '../hooks/useJobs';
import JobFilterBar from '../components/JobFilterBar';
import JobCard from '../components/JobCard';
import JobEditorModal from '../components/JobEditorModal';
import { useToast } from '../../../components/ui/toast';

export default function Jobs() {
  const { jobs, loading, error, createJob, updateJob, deleteJob } = useJobs();
  const { toast } = useToast();
  const [filters, setFilters] = useState({ query: '', status: 'all' });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [confirming, setConfirming] = useState<Job | null>(null);

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const titleMatch = j.title.toLowerCase().includes(filters.query.toLowerCase());
      const statusMatch = filters.status === 'all' ? true : j.status === filters.status;
      return titleMatch && statusMatch;
    });
  }, [jobs, filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">My Jobs</h1>
        <Button onClick={() => { setEditing(null); setEditorOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
          Post Job
        </Button>
      </div>

      <Card className="border-2 border-slate-200 shadow-xl">
        <CardHeader className="space-y-3 bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-slate-800">Job Listings</CardTitle>
          <JobFilterBar
            query={filters.query}
            status={filters.status}
            onChange={(next) => setFilters(prev => ({ ...prev, ...next }))}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="text-sm text-slate-600">Loading jobs…</div>}
          {error && <div className="text-sm text-red-600 font-semibold">{error}</div>}
          {filtered.length === 0 && !loading && (
            <div className="text-sm text-slate-600">No jobs found</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={(j) => { setEditing(j); setEditorOpen(true); }}
                onDelete={(j) => setConfirming(j)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <JobEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
        onSubmit={async (values) => {
          try {
            if (editing) {
              await updateJob(editing.id, values);
              toast({ title: 'Job updated', description: 'Your changes have been saved', variant: 'success' });
            } else {
              await createJob(values);
              toast({ title: 'Job created', description: 'Job posted successfully', variant: 'success' });
            }
          } catch (e: any) {
            toast({ title: 'Action failed', description: e?.response?.data?.error || 'Please try again', variant: 'error' });
          }
        }}
      />

      {confirming && (
        <Card className="fixed bottom-6 right-6 w-full max-w-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Delete “{confirming.title}”?</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirming(null)}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  await deleteJob(confirming.id);
                  toast({ title: 'Job deleted', description: 'The job has been removed', variant: 'success' });
                } catch (e: any) {
                  toast({ title: 'Delete failed', description: e?.response?.data?.error || 'Please try again', variant: 'error' });
                } finally {
                  setConfirming(null);
                }
              }}
            >
              Confirm Delete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


