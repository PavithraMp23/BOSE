import React from 'react';
import type { Applicant } from '../hooks/useApplicants';
import ApplicantRow from './ApplicantRow';

interface Props {
  data: Applicant[];
  onUpdate: (id: string, status: Applicant['status']) => void;
}

export default function ApplicantTable({ data, onUpdate }: Props) {
  if (!data.length) {
    return <div className="text-gray-500 text-center py-10">No applicants yet.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Applied</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <ApplicantRow key={a.id} applicant={a} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}


