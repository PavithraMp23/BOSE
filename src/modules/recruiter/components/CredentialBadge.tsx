import React from 'react';

export default function CredentialBadge({ verified }: { verified: boolean }) {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${verified ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'}`}>
      {verified ? 'Verified' : 'Unverified'}
    </span>
  );
}


