import React, { useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import MessageThread from '../components/MessageThread';
import MessageInput from '../components/MessageInput';

export default function Messages() {
  const [candidateId, setCandidateId] = useState('C-001');
  const { messages, sendMessage } = useMessages(candidateId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Candidate:</label>
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
        >
          <option value="C-001">C-001</option>
          <option value="C-002">C-002</option>
        </select>
      </div>
      <MessageThread messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}


