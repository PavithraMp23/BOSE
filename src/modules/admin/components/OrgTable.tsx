import { useOrganizations } from "../hooks/useOrganizations";

export default function OrgTable() {
  const { orgs, approveOrg } = useOrganizations();
  return (
    <table className="min-w-full text-sm border border-gray-800 rounded-xl overflow-hidden">
      <thead className="bg-secondary/60 text-gray-400">
        <tr>
          <th className="p-3">Organization</th>
          <th className="p-3">Status</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {orgs.map(o => (
          <tr key={o.id} className="border-b border-gray-800">
            <td className="p-3">{o.name}</td>
            <td className="p-3">{o.approved ? "Approved" : "Pending"}</td>
            <td className="p-3">
              {!o.approved && (
                <button
                  onClick={() => approveOrg(o.id)}
                  className="bg-accent text-black px-3 py-1 rounded-md"
                >
                  Approve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


