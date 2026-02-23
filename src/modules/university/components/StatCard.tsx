import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {trend && trendValue && (
                <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}
          </div>
          {Icon && (
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}