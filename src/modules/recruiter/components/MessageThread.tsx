import React from 'react';

interface Props {
  messages: { sender: string; text: string; time?: string }[];
}

export default function MessageThread({ messages }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-96 overflow-y-auto">
      {messages.map((m, i) => (
        <div key={i} className={`my-2 flex ${m.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs px-3 py-2 rounded-lg ${m.sender === 'recruiter' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}


