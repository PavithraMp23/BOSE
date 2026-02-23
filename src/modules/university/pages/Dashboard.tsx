import React, { useState } from 'react';
import { useVerificationRequests } from '../hooks/useUniversityAPI';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function UniversityDashboard() {
  const { data: requestsData, loading } = useVerificationRequests(1, 5);

  // Calculate stats from all data
  const pendingCount = requestsData?.data?.filter((r: any) => r.status === 'pending').length || 0;
  const verifiedCount = requestsData?.data?.filter((r: any) => r.status === 'approved').length || 0;
  const rejectedCount = requestsData?.data?.filter((r: any) => r.status === 'rejected').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">University Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the credential verification system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Verification"
          value={pendingCount}
          description="Awaiting review"
          icon={Clock}
          trend={pendingCount > 0 ? 'up' : 'down'}
          trendValue={`${pendingCount} requests`}
        />
        <StatCard
          title="Verified Credentials"
          value={verifiedCount}
          description="Successfully approved"
          icon={CheckCircle}
          trend="up"
          trendValue={`${verifiedCount} credentials`}
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          description="Needs resubmission"
          icon={AlertCircle}
        />
      </div>

      {/* Recent Verifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Verification Requests</CardTitle>
          <CardDescription>Last 5 submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : requestsData?.data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No verification requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requestsData?.data?.map((req: any) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{req.studentName}</p>
                    <p className="text-sm text-gray-500">{req.certificateTitle}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {format(new Date(req.submittedAt), 'MMM dd, yyyy')}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : req.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Quick Actions</h3>
              <p className="text-sm text-blue-700 mt-1">
                Navigate to Verification Requests to approve or reject credentials. Use Issued Credentials to view history and analytics for detailed insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}