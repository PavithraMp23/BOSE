import { useAdminSummary } from "../hooks/useAdminSummary";
import OrgTable from "../components/OrgTable";

export default function AdminDashboard() {
  const { data, loading } = useAdminSummary();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary p-4 rounded-xl">Total Orgs: {data?.totalOrgs}</div>
          <div className="bg-secondary p-4 rounded-xl">Approved: {data?.approvedOrgs}</div>
          <div className="bg-secondary p-4 rounded-xl">Pending: {data?.pending}</div>
        </div>
      )}
      <h2 className="text-xl font-semibold">Organizations</h2>
      <OrgTable />
    </div>
  );
}


