import React from 'react';
import type { Applicant } from '../hooks/useApplicants';
import ApplicantActions from './ApplicantActions';

interface Props {
  applicant: Applicant;
  onUpdate: (id: string, status: Applicant['status']) => void;
}

export default function ApplicantRow({ applicant, onUpdate }: Props) {
  const badgeColors: Record<Applicant['status'], string> = {
    applied: 'bg-gray-100 text-gray-800',
    shortlisted: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-100 text-green-800',
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="p-3">{applicant.name}</td>
      <td className="p-3 text-gray-500">{applicant.email}</td>
      <td className="p-3 text-gray-500">{new Date(applicant.appliedAt).toLocaleDateString()}</td>
      <td className="p-3">
        <span className={`px-2 py-1 text-xs rounded-full ${badgeColors[applicant.status]}`}>
          {applicant.status}
        </span>
      </td>
      <td className="p-3">
        <ApplicantActions applicant={applicant} onUpdate={onUpdate} />
      </td>
    </tr>
  );
}


