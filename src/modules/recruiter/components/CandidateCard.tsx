import React from 'react';
import type { Candidate } from '../hooks/useCandidateSearch';
import CredentialBadge from './CredentialBadge';

interface Props {
  candidate: Candidate;
  onView: (id: string) => void;
}

export default function CandidateCard({ candidate, onView }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow cursor-pointer" onClick={() => onView(candidate.id)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{candidate.name}</h3>
        <CredentialBadge verified={candidate.verified} />
      </div>
      <p className="text-sm text-gray-500">{candidate.location}</p>
      <p className="text-sm text-gray-600 mt-2">Skills: {candidate.skills.join(', ')}</p>
      <p className="text-sm text-gray-600">Experience: {candidate.experience} yrs</p>
    </div>
  );
}


