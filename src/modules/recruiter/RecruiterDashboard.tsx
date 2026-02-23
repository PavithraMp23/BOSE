import React from 'react';
import { Button } from '../../components/ui/button';
import StatCard from './components/StatCard';
import ActivityFeed from './components/ActivityFeed';
import { useRecruiterSummary } from './hooks/useRecruiterSummary';

export default function RecruiterDashboard() {
  const { summary, activity, loading, error } = useRecruiterSummary();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Recruiter Dashboard
          </h1>
          <p className="text-slate-600">
            Overview and quick actions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="gradient"
            onClick={() => { window.location.hash = '#post-job'; }}
            className="shadow-lg"
          >
            Post Job
          </Button>
          <Button
            variant="outline"
            onClick={() => { window.location.hash = '#search'; }}
          >
            Search Candidates
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-slate-600">Loading dashboard…</p>
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Jobs" value={summary?.totalJobs ?? 0} color="blue" />
            <StatCard label="Open Jobs" value={summary?.openJobs ?? 0} color="green" />
            <StatCard label="Total Candidates" value={summary?.totalCandidates ?? 0} color="yellow" />
            <StatCard label="Verified Candidates" value={summary?.verifiedCandidates ?? 0} color="purple" />
          </div>

          <ActivityFeed items={activity} />
        </>
      )}
    </div>
  );
}


