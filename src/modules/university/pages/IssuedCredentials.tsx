import React, { useState } from 'react';
import { useIssuedCredentials } from '../hooks/useUniversityAPI';
import DataTable from '../components/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { format, subMonths } from 'date-fns';
import { Filter } from 'lucide-react';

export default function IssuedCredentials() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const { data, loading, error } = useIssuedCredentials(page, 10, typeFilter, startDate, endDate);

  const handleSetDateRange = (months: number) => {
    const end = new Date();
    const start = subMonths(end, months);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setPage(1);
  };

  const handleClearFilters = () => {
    setTypeFilter(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
  };

  const columns = [
    {
      key: 'studentName',
      label: 'Student Name',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'credentialType',
      label: 'Credential Type',
      render: (value: string) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'issuedAt',
      label: 'Issued Date',
      render: (value: string) => {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        return format(d, 'MMM dd, yyyy HH:mm');
      }
    },
    {
      key: 'hash',
      label: 'Hash',
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
          {value.substring(0, 16)}...
        </code>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issued Credentials</h1>
        <p className="text-gray-500 mt-1">View all verified and issued credentials</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <h3 className="font-medium text-gray-900">Filters</h3>
            </div>
            {(typeFilter || startDate || endDate) && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credential Type
            </label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={!typeFilter ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTypeFilter(undefined);
                  setPage(1);
                }}
              >
                All Types
              </Button>
              {['Degree', 'Certificate', 'License', 'Diploma'].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTypeFilter(type);
                    setPage(1);
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              <Button
                variant={!startDate && !endDate ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleClearFilters()}
              >
                All Dates
              </Button>
              <Button
                variant={startDate ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSetDateRange(1)}
              >
                Last Month
              </Button>
              <Button
                variant={startDate ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSetDateRange(3)}
              >
                Last 3 Months
              </Button>
              <Button
                variant={startDate ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSetDateRange(6)}
              >
                Last 6 Months
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">From</label>
                <Input
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => {
                    setStartDate(e.target.value || undefined);
                    setPage(1);
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">To</label>
                <Input
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => {
                    setEndDate(e.target.value || undefined);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={loading}
    error={error || undefined}
        pagination={{
          page,
          limit: 10,
          total: data?.pagination?.total
        }}
        onPageChange={setPage}
      />
    </div>
  );
}