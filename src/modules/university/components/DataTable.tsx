import React from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total?: number;
  };
  onPageChange?: (page: number) => void;
  rowKey?: string;
}

export default function DataTable({
  columns,
  data,
  loading,
  error,
  pagination,
  onPageChange,
  rowKey = '_id'
}: DataTableProps) {
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No data found</p>
        </div>
      </Card>
    );
  }

  const totalPages = pagination?.total ? Math.ceil(pagination.total / (pagination.limit || 10)) : 1;
  const currentPage = pagination?.page || 1;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${col.width ? `w-${col.width}` : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row[rowKey] || idx}
                className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={`${row[rowKey]}-${col.key}`} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} {pagination.total && `(${pagination.total} total)`}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const page = idx + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}