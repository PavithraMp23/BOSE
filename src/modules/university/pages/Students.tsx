import React, { useState } from 'react';
import { useStudentSearch } from '../hooks/useUniversityAPI';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Users } from 'lucide-react';

interface StudentFilterParams {
  name?: string;
  email?: string;
  degree?: string;
}

export default function Students() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<StudentFilterParams>({});
  const [searchInput, setSearchInput] = useState('');

  const { data, loading, error } = useStudentSearch(
    page,
    10,
    filters.name,
    filters.email,
    filters.degree
  );

  const handleSearch = (query: string) => {
    setSearchInput(query);
    setPage(1);
    
    // Auto-detect search type
    if (!query) {
      setFilters({});
    } else if (query.includes('@')) {
      setFilters({ email: query });
    } else {
      setFilters({ name: query });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => <span className="text-sm text-gray-600">{value}</span>
    },
    {
      key: 'enrollmentNumber',
      label: 'Enrollment #',
      render: (value: string | undefined) => (
        <span className="text-sm font-mono text-gray-500">{value || '-'}</span>
      )
    },
    {
      key: 'degree',
      label: 'Degree',
      render: (value: string | undefined) => (
        <span className="text-sm">{value || '-'}</span>
      )
    },
    {
      key: 'credentialsSummary',
      label: 'Credentials',
      render: (summary: any) => (
        <div className="flex gap-2">
          <StudentBadge variant="secondary">
            {summary?.issued || 0} Issued
          </StudentBadge>
          <StudentBadge variant="outline">
            {summary?.pending || 0} Pending
          </StudentBadge>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Directory</h1>
        <p className="text-gray-500 mt-1">Search and manage student credentials</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <CardTitle className="text-lg">Search Students</CardTitle>
              <CardDescription>
                Search by name, email, or degree. Use @ for email search.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SearchBar
            placeholder="Enter student name, email, or degree..."
            onSearch={handleSearch}
            loading={loading}
          />
          {searchInput && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-900">
                Searching for: <span className="font-semibold">{searchInput}</span>
                {filters.email && ' (Email)'}
                {filters.name && ' (Name)'}
                {filters.degree && ' (Degree)'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Results {data?.pagination?.total ? `(${data.pagination.total} found)` : ''}
          </h2>
        </div>

        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={loading}
          error={error}
          pagination={{
            page,
            limit: 10,
            total: data?.pagination?.total
          }}
          onPageChange={setPage}
        />
      </div>

      {/* Info Card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">About Credentials Summary</h3>
              <p className="text-sm text-amber-700 mt-1">
                <strong>Issued:</strong> Credentials that have been approved and verified.
                <br />
                <strong>Pending:</strong> Credentials awaiting review and approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Badge component for credential summary
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
}

function StudentBadge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-green-100 text-green-800',
    outline: 'border border-gray-300 text-gray-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}