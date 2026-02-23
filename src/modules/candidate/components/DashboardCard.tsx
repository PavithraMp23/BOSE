import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Props { 
  label: string; 
  value: number | string;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  trend?: number;
  icon?: React.ReactNode;
}

const colorConfig: Record<NonNullable<Props['color']>, {
  text: string;
  bg: string;
  gradient: string;
}> = {
  blue: {
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    gradient: 'from-green-500 to-green-600',
  },
  yellow: {
    text: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    gradient: 'from-yellow-500 to-yellow-600',
  },
  purple: {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    gradient: 'from-purple-500 to-purple-600',
  },
};

export default function DashboardCard({ label, value, color = 'blue', trend, icon }: Props) {
  const config = colorConfig[color];

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={cn('absolute top-0 right-0 w-32 h-32 bg-gradient-to-br', config.gradient, 'opacity-10 rounded-full -mr-16 -mt-16')} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-xl', config.bg)}>
            {icon || <div className={cn('w-6 h-6 rounded-lg bg-gradient-to-br', config.gradient, 'shadow-sm')} />}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm', trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={cn('text-4xl font-bold mb-2', config.text)}>{value}</div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
      </CardContent>
    </Card>
  );
}


