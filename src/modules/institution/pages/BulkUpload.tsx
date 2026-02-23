import CredentialForm from '../components/CredentialForm';
import { useToast } from '../../../components/ui/toast';

export default function BulkUpload() {
  const { toast } = useToast();

  const handleIssued = () => {
    toast({
      title: "Success",
      description: "Credentials have been issued successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bulk Upload</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload and process multiple credentials at once.
        </p>
      </div>
      <CredentialForm onIssued={handleIssued} />
    </div>
  );
}