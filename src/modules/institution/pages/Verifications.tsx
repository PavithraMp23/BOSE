import React from 'react';
import VerificationRequests from '../components/VerificationRequests';

export default function Verifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Verification Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and process credential verification requests from candidates.
        </p>
      </div>
      <VerificationRequests />
    </div>
  );
}