import { useState } from "react";
import CredentialForm from "../components/CredentialForm";
import IssuedList from "../components/IssuedList";
import VerificationRequests from "../components/VerificationRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

export default function InstitutionDashboard() {
  const [activeTab, setActiveTab] = useState("verifications");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">University Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="verifications">Verification Requests</TabsTrigger>
          <TabsTrigger value="issue">Issue Credential</TabsTrigger>
          <TabsTrigger value="issued">Issued Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="mt-6">
          <VerificationRequests />
        </TabsContent>

        <TabsContent value="issue" className="mt-6">
          <CredentialForm onIssued={() => {}} />
        </TabsContent>

        <TabsContent value="issued" className="mt-6">
          <IssuedList />
        </TabsContent>
      </Tabs>
    </div>
  );
}


