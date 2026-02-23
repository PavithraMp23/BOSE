import React from 'react';
import type { Candidate } from '../hooks/useCandidateSearch';
import CredentialBadge from './CredentialBadge';

interface Props {
  data: Candidate[];
  onView: (id: string) => void;
}

export default function CandidateTable({ data, onView }: Props) {
  if (!data.length) return <div className="text-gray-500 text-center py-10">No candidates found.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Location</th>
            <th className="p-3">Experience</th>
            <th className="p-3">Verified</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3">{c.name}</td>
              <td className="p-3 text-gray-600">{c.location}</td>
              <td className="p-3 text-gray-600">{c.experience} yrs</td>
              <td className="p-3"><CredentialBadge verified={c.verified} /></td>
              <td className="p-3">
                <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50" onClick={() => onView(c.id)}>
                  View Credentials
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


