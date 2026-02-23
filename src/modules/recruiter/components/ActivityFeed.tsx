import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { ActivityItem } from '../hooks/useRecruiterSummary';

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card className="border-2 border-slate-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-slate-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-slate-600">No recent activity</div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {items.map((item) => (
              <li key={item.id} className="py-3 flex items-start justify-between hover:bg-slate-50 px-2 rounded transition-colors">
                <span className="text-sm text-slate-800 font-medium">{item.message}</span>
                <span className="text-xs text-slate-600 whitespace-nowrap ml-3">{new Date(item.time).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}


