import React, { useState } from 'react';
import { useApplicants } from '../hooks/useApplicants';
import ApplicantTable from '../components/ApplicantTable';

export default function Applicants() {
  const [jobId, setJobId] = useState('J-1001');
  const { data, loading, error, updateStatus } = useApplicants(jobId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applicants</h1>
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        >
          <option value="J-1001">Job #1001</option>
          <option value="J-1002">Job #1002</option>
        </select>
      </div>

      {loading && <p>Loading applicants...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <ApplicantTable data={data} onUpdate={updateStatus} />}
    </div>
  );
}


