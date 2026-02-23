import React, { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText('');
      }}
      className="flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        className="flex-1 px-3 py-2 rounded-md border border-gray-300"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">
        Send
      </button>
    </form>
  );
}


