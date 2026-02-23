import React from 'react';
import type { Applicant } from '../hooks/useApplicants';

interface Props {
  applicant: Applicant;
  onUpdate: (id: string, status: Applicant['status']) => void;
}

export default function ApplicantActions({ applicant, onUpdate }: Props) {
  const buttons = [
    { label: 'Shortlist', status: 'shortlisted', color: 'text-blue-400' },
    { label: 'Reject', status: 'rejected', color: 'text-red-500' },
    { label: 'Hire', status: 'hired', color: 'text-green-500' },
  ];

  return (
    <div className="flex gap-2">
      {buttons.map((b) => (
        <button
          key={b.status}
          onClick={() => onUpdate(applicant.id, b.status as Applicant['status'])}
          className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 ${b.color}`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}


