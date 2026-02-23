import React, { useState } from 'react';
import { useVerificationRequests } from '../hooks/useUniversityAPI';
import { useCredentialActions } from '../hooks/useCredentialActions';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import RejectModal from '../components/RejectModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';

export default function VerificationRequests() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data, loading, error } = useVerificationRequests(page, 10, statusFilter);
  const { approve, reject, loadingApprove, loadingReject } = useCredentialActions();

  const handleApprove = async (requestId: string) => {
    setSelectedRequest(data?.data?.find((r: any) => r._id === requestId));
    setShowApproveModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;
    try {
      await approve(selectedRequest._id, () => {
        setShowApproveModal(false);
        setSelectedRequest(null);
        setRefreshTrigger((v) => v + 1);
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleReject = (requestId: string) => {
    setSelectedRequest(data?.data?.find((r: any) => r._id === requestId));
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedRequest) return;
    try {
      await reject(selectedRequest._id, reason, () => {
        setShowRejectModal(false);
        setSelectedRequest(null);
        setRefreshTrigger((v) => v + 1);
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  const columns = [
    {
      key: 'studentName',
      label: 'Student Name',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'certificateTitle',
      label: 'Certificate',
      render: (value: string) => <span className="text-sm">{value}</span>
    },
    {
      key: 'submittedAt',
      label: 'Submitted',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            value === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : value === 'approved'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: '_id',
      label: 'Actions',
      render: (id: string, row: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleApprove(id)}
            disabled={row.status !== 'pending' || loadingApprove === id}
          >
            {loadingApprove === id ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleReject(id)}
            disabled={row.status !== 'pending' || loadingReject === id}
          >
            {loadingReject === id ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
        <p className="text-gray-500 mt-1">Review and approve or reject credential submissions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <h3 className="font-medium text-gray-900">Filter by Status</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!statusFilter ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter(undefined);
                setPage(1);
              }}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter('pending');
                setPage(1);
              }}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter('approved');
                setPage(1);
              }}
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter('rejected');
                setPage(1);
              }}
            >
              Rejected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
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

      {/* Modals */}
      <ConfirmModal
        open={showApproveModal}
        title="Approve Credential"
        description={`Are you sure you want to approve the credential for ${selectedRequest?.studentName}? This action will generate a verification hash.`}
        confirmText="Approve"
        loading={loadingApprove === selectedRequest?._id}
        onConfirm={handleConfirmApprove}
        onCancel={() => {
          setShowApproveModal(false);
          setSelectedRequest(null);
        }}
      />

      <RejectModal
        open={showRejectModal}
        studentName={selectedRequest?.studentName}
        loading={loadingReject === selectedRequest?._id}
        onReject={handleConfirmReject}
        onCancel={() => {
          setShowRejectModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}