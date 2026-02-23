import React, { useState } from 'react';
import CandidateSearchBar from '../components/CandidateSearchBar';
import CandidateCard from '../components/CandidateCard';
import CandidateTable from '../components/CandidateTable';
import { useCandidateSearch } from '../hooks/useCandidateSearch';
import { useCredentialLookup } from '../hooks/useCredentialLookup';

export default function Candidates() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { data, loading, error } = useCandidateSearch(filters);
  const { data: creds, fetchCredentials, loading: credLoading } = useCredentialLookup();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Candidate Search</h1>
      <CandidateSearchBar onSearch={setFilters} />
      {loading && <p className="text-slate-600">Loading candidates...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((c) => (
          <CandidateCard key={c.id} candidate={c} onView={fetchCredentials} />
        ))}
      </div>

      {data.length === 0 && !loading && !error && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-slate-200">
          <p className="text-slate-600">No candidates found. Try adjusting your search filters.</p>
        </div>
      )}

      {/* Optional table view example (not wired to toggle) */}
      {/* <CandidateTable data={data} onView={fetchCredentials} /> */}

      {credLoading && <p className="text-slate-600">Loading credentials...</p>}
      {creds && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-lg">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Credentials for {creds.candidateId}</h2>
          <ul className="space-y-2 text-sm">
            {creds.credentials.map((cr: any) => (
              <li key={cr.credentialId} className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-800 font-medium">
                  {cr.type} – {cr.issuer}
                </span>
                <span className={cr.status === 'verified' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>
                  {cr.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


