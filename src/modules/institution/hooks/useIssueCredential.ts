import api from "../../../lib/api";
import { useToast } from "../../../components/ui/toast";

export function useIssueCredential(onSuccess?: () => void) {
  const { toast } = useToast();

  const issue = async (payload: any) => {
    await api.post("/api/credentials/issue", payload);
    toast({ title: "Credential issued", variant: "success" });
    onSuccess && onSuccess();
  };
  return { issue };
}


