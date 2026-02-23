import { Routes, Route } from 'react-router-dom';
import InstitutionDashboard from './pages/InstitutionDashboard';
import Verifications from './pages/Verifications';
import IssuedCredentials from './pages/IssuedCredentials';
import BulkUpload from './pages/BulkUpload';
import Analytics from './pages/Analytics';

export default function InstitutionRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InstitutionDashboard />} />
      <Route path="/verifications" element={<Verifications />} />
      <Route path="/issued" element={<IssuedCredentials />} />
      <Route path="/bulk" element={<BulkUpload />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}