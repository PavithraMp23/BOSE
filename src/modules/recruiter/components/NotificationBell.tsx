import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell() {
  const { data, markRead } = useNotifications();
  const unread = data.filter((n) => !n.read);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Bell className="cursor-pointer" />
      {unread.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white px-1 rounded-full">
          {unread.length}
        </span>
      )}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {data.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No notifications</div>
          ) : (
            data.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`p-3 border-b last:border-0 cursor-pointer ${n.read ? 'opacity-60' : 'opacity-100'}`}
              >
                <p className="text-sm text-gray-900">{n.message}</p>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


