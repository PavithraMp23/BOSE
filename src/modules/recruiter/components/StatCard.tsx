import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  trend?: number;
}

const colorConfig: Record<NonNullable<StatCardProps['color']>, {
  text: string;
  bg: string;
  gradient: string;
  icon: string;
}> = {
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    gradient: 'from-blue-500 to-blue-600',
    icon: 'text-blue-500',
  },
  green: {
    text: 'text-green-600',
    bg: 'bg-green-50',
    gradient: 'from-green-500 to-green-600',
    icon: 'text-green-500',
  },
  yellow: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-50',
    gradient: 'from-yellow-500 to-yellow-600',
    icon: 'text-yellow-500',
  },
  purple: {
    text: 'text-purple-600',
    bg: 'bg-purple-50',
    gradient: 'from-purple-500 to-purple-600',
    icon: 'text-purple-500',
  },
};

export default function StatCard({ label, value, color = 'blue', trend }: StatCardProps) {
  const config = colorConfig[color];

  return (
    <Card className="relative overflow-hidden border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full -mr-16 -mt-16`} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${config.bg}`}>
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${config.gradient} shadow-md`} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-semibold">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`text-4xl font-bold mb-2 ${config.text}`}>{value}</div>
        <div className="text-sm font-semibold text-slate-600">{label}</div>
      </CardContent>
    </Card>
  );
}


