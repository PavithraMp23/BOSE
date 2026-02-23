import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          View statistics and reports about credential issuance and verification.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Total Credentials Issued</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">324</p>
          <p className="mt-1 text-sm text-gray-500">+12% from last month</p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Pending Verifications</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">45</p>
          <p className="mt-1 text-sm text-gray-500">Average 2 day response time</p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Verification Rate</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">98%</p>
          <p className="mt-1 text-sm text-gray-500">+2% from last month</p>
        </div>
      </div>
    </div>
  );
}