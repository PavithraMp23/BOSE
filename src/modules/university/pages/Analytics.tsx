import React from 'react';
import { useAnalytics } from '../hooks/useUniversityAPI';
import StatCard from '../components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Award, Clock } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const { data, loading, error } = useAnalytics();

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-700">Error loading analytics: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const credentialBreakdown = data?.credentialBreakdown || [];
  const monthlyStats = data?.monthlyStats || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500 mt-1">Comprehensive overview of credential verification activities</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={summary.totalRequests || 0}
          description="All time submissions"
          icon={Calendar}
        />
        <StatCard
          title="Pending"
          value={summary.pendingRequests || 0}
          description="Awaiting review"
          icon={Clock}
        />
        <StatCard
          title="Verified"
          value={summary.approvedCredentials || 0}
          description="Approved credentials"
          icon={Award}
        />
        <StatCard
          title="Avg Verification Time"
          value={`${summary.averageVerificationTimeMinutes?.toFixed(0) || 0} min`}
          description="Average processing time"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Issued Credentials</CardTitle>
            <CardDescription>Credentials issued over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="issued"
                    stroke="#3b82f6"
                    dot={{ fill: '#3b82f6' }}
                    name="Credentials Issued"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credential Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Credential Type Distribution</CardTitle>
            <CardDescription>Breakdown by credential type</CardDescription>
          </CardHeader>
          <CardContent>
            {credentialBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={credentialBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.type}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {credentialBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Credential Status Overview</CardTitle>
          <CardDescription>Visual breakdown of all credentials by status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                {
                  name: 'Total Requests',
                  value: summary.totalRequests || 0,
                  pending: summary.pendingRequests || 0,
                  approved: summary.approvedCredentials || 0,
                  rejected: summary.rejectedRequests || 0
                }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
              <Bar dataKey="approved" stackId="a" fill="#10b981" name="Approved" />
              <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest credential verification activities</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.student}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Approval Rate</span>
            <span className="font-semibold text-gray-900">
              {summary.totalRequests
                ? (
                    ((summary.approvedCredentials || 0) / summary.totalRequests) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Rejection Rate</span>
            <span className="font-semibold text-gray-900">
              {summary.totalRequests
                ? (
                    ((summary.rejectedRequests || 0) / summary.totalRequests) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Pending Rate</span>
            <span className="font-semibold text-gray-900">
              {summary.totalRequests
                ? (
                    ((summary.pendingRequests || 0) / summary.totalRequests) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}