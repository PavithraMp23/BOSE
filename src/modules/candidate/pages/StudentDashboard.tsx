import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/toast';
import api from '../../../lib/api';
import { jsPDF } from 'jspdf';

// Layout and Types
import StudentLayout from './dashboard/StudentLayout';
import { DashboardSection, CertificateItem, SkillBadge, JobHistory } from './dashboard/types';

// Page Components
import DashboardHome from './dashboard/DashboardHome';
import UploadCredits from './dashboard/UploadCredits';
import Portfolio from './dashboard/Portfolio';
import ShareCredentials from './dashboard/ShareCredentials';
import Recommendations from './dashboard/Recommendations';
import Analytics from './dashboard/Analytics';
import CertificateDetailsModal from './dashboard/CertificateDetailsModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'; // For Quick Share Modal if needed, using ShareCredentials instead?
// Note: DashboardHome has a Share button that opens a simple share modal. 
// We can use the ShareCredentials component's modal or a simplified one. 
// For now, I will use a simple state to show ShareCredentials page or a modal. 
// Actually, the original design had a "Share Modal" triggered from Dashboard. 
// I'll reuse a simple Share Dialog here or redirect to Share tab? 
// The original code had a share modal pop up. I'll include a simple Share Modal here.

import { Share2, QrCode } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [skillBadges, setSkillBadges] = useState<SkillBadge[]>([]);
  const [jobHistory, setJobHistory] = useState<JobHistory[]>([]);

  // Modals state
  const [certificateDetailsOpen, setCertificateDetailsOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const studentProfile = useMemo(() => ({
    name: user?.name || 'Student Name',
    role: user?.role || 'Student',
    email: user?.email || 'student@example.com',
    program: 'B.Tech Computer Science', // Dummy
    enrollmentId: 'CS2024001' // Dummy
  }), [user]);

  useEffect(() => {
    // Load existing credentials
    const fetchCredentials = async () => {
      try {
        const response = await api.get('/api/credentials/my');
        if (response.data) {
          setCertificates(response.data.map((c: any) => ({
            ...c,
            uploadedAt: c.issuedOn || new Date().toISOString(), // Map issuedOn to uploadedAt if needed
            status: c.status || 'pending'
          })));
        }
      } catch (error) {
        console.error('Failed to load credentials', error);
        // Fallback dummy data if API fails (matching original behavior roughly, or just empty)
        setCertificates([
          {
            id: '1',
            name: 'Advanced React Certification',
            fileName: 'react-cert.pdf',
            status: 'verified',
            uploadedAt: '2023-12-15T10:00:00Z',
            verifiedBy: 'Meta',
            verifiedAt: '2023-12-20T14:30:00Z',
            type: 'certification',
            institution: 'Meta via Coursera',
            grade: '98%',
            issueDate: '2023-12-10',
            skills: ['React', 'Redux', 'Web Performance'],
            description: 'Advanced certification in React development'
          },
          {
            id: '2',
            name: 'B.Tech Computer Science',
            fileName: 'degree.pdf',
            status: 'verified',
            uploadedAt: '2023-06-01T09:00:00Z',
            verifiedBy: 'University of Technology',
            verifiedAt: '2023-06-15T11:20:00Z',
            type: 'degree',
            institution: 'University of Technology',
            grade: '3.8 GPA',
            skills: ['React', 'Redux', 'Web Performance'],
            issueDate: '2023-05-20',
            description: 'Bachelor of Technology in Computer Science'
          }
        ]);
      }
    };

    fetchCredentials();

    // Dummy data for others
    setSkillBadges([
      { id: 's1', name: 'React', level: 'expert', category: 'Frontend', verified: true, verifiedBy: 'Meta', verifiedAt: '2023-12-20T14:30:00Z' },
      { id: 's2', name: 'Node.js', level: 'advanced', category: 'Backend', verified: true, verifiedBy: 'OpenJS Foundation', verifiedAt: '2024-01-15T09:00:00Z' },
      { id: 's3', name: 'Python', level: 'intermediate', category: 'Data Science', verified: false }
    ]);

    setJobHistory([
      {
        id: 'j1',
        title: 'Frontend Intern',
        company: 'TechStarts Inc.',
        startDate: '2023-01-10',
        endDate: '2023-04-10',
        description: 'Built responsive UI components using React and Tailwind CSS.',
        skills: ['React', 'CSS', 'Git'],
        verified: true,
        verifiedBy: 'TechStarts HR',
        verifiedAt: '2023-04-15T10:00:00Z'
      }
    ]);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportPortfolio = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(33, 150, 243);
    doc.text('Student Portfolio', 105, yPosition, { align: 'center' });
    yPosition += 15;

    // Profile Info
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Name: ${studentProfile.name}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Email: ${studentProfile.email}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Program: ${studentProfile.program}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Enrollment ID: ${studentProfile.enrollmentId}`, 20, yPosition);
    yPosition += 20;

    // Certificates
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243);
    doc.text('Verified Credentials', 20, yPosition);
    yPosition += 10;

    certificates.forEach((cert) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${cert.name}`, 25, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`   Institution: ${cert.institution || 'N/A'}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Status: ${cert.status}`, 25, yPosition);
      yPosition += 10;
    });

    // Save
    doc.save(`${studentProfile.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
    toast({
      title: 'Portfolio Exported',
      description: 'Your portfolio has been downloaded as a PDF.',
      variant: 'success'
    });
  };

  // Callback to refresh certs after upload
  const handleUploadSuccess = async () => {
    try {
      const response = await api.get('/api/credentials/my');
      if (response.data) {
        setCertificates(response.data.map((c: any) => ({
          ...c,
          uploadedAt: c.issuedOn || new Date().toISOString(),
          status: c.status || 'pending'
        })));
      }
    } catch (e) {
      console.error(e);
    }
    // Switch to dashboard to see new item
    setActiveSection('dashboard');
  };

  const onViewCertificate = (cert: CertificateItem) => {
    setSelectedCertificate(cert);
    setCertificateDetailsOpen(true);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardHome
            certificates={certificates}
            jobHistory={jobHistory}
            skillBadges={skillBadges}
            onViewCertificateRequest={onViewCertificate}
            onShareOpen={() => setShareOpen(true)}
          />
        );
      case 'upload':
        return (
          <UploadCredits
            onUploadSuccess={handleUploadSuccess}
          />
        );
      case 'portfolio':
        return (
          <Portfolio
            studentProfile={studentProfile}
            certificates={certificates}
            skillBadges={skillBadges}
            jobHistory={jobHistory}
            onExport={handleExportPortfolio}
          />
        );
      case 'share':
        return <ShareCredentials userName={studentProfile.name} />;
      case 'recommendations':
        return <Recommendations />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <DashboardHome
            certificates={certificates}
            jobHistory={jobHistory}
            skillBadges={skillBadges}
            onViewCertificateRequest={onViewCertificate}
            onShareOpen={() => setShareOpen(true)}
          />
        );
    }
  };

  return (
    <StudentLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      studentProfile={studentProfile}
      onLogout={handleLogout}
    >
      {renderMainContent()}

      {/* Certificate Details Modal */}
      <CertificateDetailsModal
        isOpen={certificateDetailsOpen}
        onClose={() => setCertificateDetailsOpen(false)}
        certificate={selectedCertificate}
        onShare={() => {
          setCertificateDetailsOpen(false);
          setShareOpen(true);
        }}
      />

      {/* Quick Share Modal (Used by DashboardHome 'Share' button) */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6"
                onClick={() => {
                  toast({ title: 'Link Copied', description: 'Portfolio link copied to clipboard', variant: 'success' });
                  setShareOpen(false);
                }}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Copy Link
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6"
                onClick={() => setShareOpen(false)}
              >
                <QrCode className="w-5 h-5 mr-2" />
                Show QR Code
              </Button>
            </div>
            <p className="text-center text-sm text-slate-500">
              Or go to the <button className="text-blue-600 underline" onClick={() => { setShareOpen(false); setActiveSection('share'); }}>Share Page</button> for more options.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
