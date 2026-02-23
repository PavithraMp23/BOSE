import { useIssuedCredentials } from "../hooks/useIssuedCredentials";

export default function IssuedList() {
  const { data } = useIssuedCredentials();
  return (
    <table className="min-w-full text-sm border border-gray-800 rounded-xl">
      <thead className="bg-secondary/60 text-gray-400">
        <tr>
          <th className="p-3">ID</th>
          <th className="p-3">Student</th>
          <th className="p-3">Course</th>
          <th className="p-3">Year</th>
        </tr>
      </thead>
      <tbody>
        {data.map(c => (
          <tr key={c.id} className="border-b border-gray-800">
            <td className="p-3">{c.id}</td>
            <td className="p-3">{c.student}</td>
            <td className="p-3">{c.course}</td>
            <td className="p-3">{c.year}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


