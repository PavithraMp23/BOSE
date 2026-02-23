import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFabricTx } from '../../../hooks/useFabricTx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  Download
} from 'lucide-react';

interface AnalyticsData {
  stats: {
    total: number;
    active: number;
    revoked: number;
    byOrg: Record<string, number>;
  };
  trends: Array<{
    month: string;
    monthName: string;
    total: number;
    active: number;
    revoked: number;
  }>;
  organizations: Array<{
    organization: string;
    total: number;
    active: number;
    revoked: number;
    successRate: string;
  }>;
}

export default function Analytics() {
  const { user } = useAuth();
  const { evaluateTransaction, loading } = useFabricTx();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('12months');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const [statsResult, trendsResult, orgsResult] = await Promise.all([
        evaluateTransaction('analytics/stats'),
        evaluateTransaction('analytics/trends'),
        evaluateTransaction('analytics/organizations')
      ]);

      if (statsResult.success && trendsResult.success) {
        setAnalyticsData({
          stats: statsResult.data.stats,
          trends: trendsResult.data.trends,
          organizations: orgsResult.success ? orgsResult.data.organizations : []
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (!['auditor', 'employer'].includes(user?.role || '')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600">Analytics are only available to auditors and employers.</p>
      </div>
    );
  }

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { stats, trends, organizations } = analyticsData;

  // Prepare data for charts
  const orgDistributionData = Object.entries(stats.byOrg).map(([org, count]) => ({
    name: org,
    value: count,
    color: getOrgColor(org)
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  function getOrgColor(org: string) {
    const colors = {
      'Org1MSP': '#3B82F6',
      'Org2MSP': '#8B5CF6',
      'Org3MSP': '#10B981'
    };
    return colors[org as keyof typeof colors] || '#6B7280';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive credential network insights</p>
        </div>

        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-200 rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Network-wide issuance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((stats.active / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{stats.active} active credentials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revocation Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {((stats.revoked / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{stats.revoked} revoked credentials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">Active issuers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issuance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Credential Issuance Trends</CardTitle>
            <CardDescription>Monthly credential issuance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    const date = new Date(value + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short' });
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value + '-01');
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="revoked"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Organization Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Credential Distribution by Organization</CardTitle>
            <CardDescription>Total credentials issued by each organization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orgDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orgDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Organization Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Performance</CardTitle>
          <CardDescription>Detailed performance metrics by organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold">Total Issued</th>
                  <th className="text-left py-3 px-4 font-semibold">Active</th>
                  <th className="text-left py-3 px-4 font-semibold">Revoked</th>
                  <th className="text-left py-3 px-4 font-semibold">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.organization} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getOrgColor(org.organization) }}
                        ></div>
                        <span className="font-medium">{org.organization}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{org.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-medium">{org.active.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-red-600 font-medium">{org.revoked.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${parseFloat(org.successRate) >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {org.successRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Network Health */}
      <Card>
        <CardHeader>
          <CardTitle>Network Health & Performance</CardTitle>
          <CardDescription>Real-time blockchain network status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3/3</div>
              <div className="text-sm text-gray-500">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-sm text-gray-500">Block Height</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0.8s</div>
              <div className="text-sm text-gray-500">Avg Transaction Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}