import React from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface JobFilterBarProps {
  query: string;
  status: string;
  onChange: (next: { query?: string; status?: string }) => void;
}

export default function JobFilterBar({ query, status, onChange }: JobFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Search job title…"
        value={query}
        onChange={(e) => onChange({ query: e.target.value })}
        className="flex-1"
      />
      <select
        className="rounded-lg border-2 border-slate-300 px-3 py-2 text-sm text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        value={status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="closed">Closed</option>
      </select>
      <Button variant="outline" onClick={() => onChange({ query: '', status: 'all' })}>Clear</Button>
    </div>
  );
}


