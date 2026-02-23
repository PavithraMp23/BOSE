import IssuedList from '../components/IssuedList';

export default function IssuedCredentials() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Issued Credentials</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage credentials issued by your institution.
        </p>
      </div>
      <IssuedList />
    </div>
  );
}