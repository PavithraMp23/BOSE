export type RoleKey =
  | 'candidate'
  | 'student'
  | 'employee'
  | 'recruiter'
  | 'employer'
  | 'institution'
  | 'university'
  | 'verifier'
  | 'issuer'
  | 'admin'
  | 'auditor';

export const ROLE_DASHBOARD_PATH: Record<RoleKey, string> = {
  candidate: '/dashboard/candidate',
  student: '/dashboard/student',
  employee: '/dashboard/student',
  recruiter: '/dashboard/employer',
  employer: '/dashboard/employer',
  institution: '/dashboard/institution',
  university: '/university',
  verifier: '/dashboard/institution',
  issuer: '/dashboard/institution',
  admin: '/dashboard/admin',
  auditor: '/dashboard/auditor',
};

type SidebarLink = { name: string; href: string };

export const SIDEBAR_LINKS: Record<RoleKey, SidebarLink[]> = {
  // Candidate-centric
  candidate: [
    { name: 'Dashboard', href: '/dashboard/candidate' },
    { name: 'Profile', href: '/dashboard/candidate/profile' },
    { name: 'Credentials', href: '/dashboard/candidate#credentials' },
    { name: 'Applications', href: '/dashboard/candidate#applications' },
    { name: 'Messages', href: '/dashboard/candidate#messages' },
  ],

  student: [
    { name: 'Home', href: '/dashboard/student' },
    { name: 'Upload Creds', href: '/dashboard/student#upload' },
    { name: 'Portfolio', href: '/dashboard/student#portfolio' },
    { name: 'Share', href: '/dashboard/student#share' },
    { name: 'Recommendations', href: '/dashboard/student#reco' },
    { name: 'Analytics', href: '/dashboard/student#analytics' },
  ],

  employee: [
    { name: 'Home', href: '/dashboard/student' },
    { name: 'Portfolio', href: '/dashboard/student#portfolio' },
    { name: 'Analytics', href: '/dashboard/student#analytics' },
  ],

  // Recruiter / Employer
  recruiter: [
    { name: 'Home', href: '/dashboard/employer' },
    { name: 'Jobs', href: '/dashboard/employer/jobs' },
    { name: 'Applicants', href: '/dashboard/employer/applicants' },
    { name: 'Candidates', href: '/dashboard/employer/candidates' },
    { name: 'Messages', href: '/dashboard/employer/messages' },
  ],
  employer: [
    { name: 'Home', href: '/dashboard/employer' },
    { name: 'Jobs', href: '/dashboard/employer/jobs' },
    { name: 'Applicants', href: '/dashboard/employer/applicants' },
    { name: 'Candidates', href: '/dashboard/employer/candidates' },
    { name: 'Messages', href: '/dashboard/employer/messages' },
  ],

  // Institution / Verifier / Issuer
  institution: [
    { name: 'Dashboard', href: '/dashboard/institution' },
    { name: 'Verifications', href: '/dashboard/institution/verifications' },
    { name: 'Issued Credentials', href: '/dashboard/institution/issued' },
    { name: 'Bulk Upload', href: '/dashboard/institution/bulk' },
    { name: 'Analytics', href: '/dashboard/institution/analytics' },
  ],
  verifier: [
    { name: 'Dashboard', href: '/dashboard/institution' },
    { name: 'Verifications', href: '/dashboard/institution/verifications' },
    { name: 'Issued Credentials', href: '/dashboard/institution/issued' },
  ],
  issuer: [
    { name: 'Dashboard', href: '/dashboard/institution' },
    { name: 'Issue Creds', href: '/dashboard/institution/issue' },
    { name: 'Issued Credentials', href: '/dashboard/institution/issued' },
  ],

  // University (alias for institution UI routes)
  university: [
    { name: 'Dashboard', href: '/university' },
    { name: 'Verifications', href: '/university/verification-requests' },
    { name: 'Issued Credentials', href: '/university/issued-credentials' },
    { name: 'Students', href: '/university/students' },
    { name: 'Analytics', href: '/university/analytics' },
  ],

  // Admin & Auditor
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin' },
    { name: 'Users', href: '/dashboard/admin#users' },
    { name: 'Logs', href: '/dashboard/admin#logs' },
    { name: 'Settings', href: '/dashboard/admin#settings' },
  ],
  auditor: [
    { name: 'Dashboard', href: '/dashboard/auditor' },
    { name: 'Reports', href: '/dashboard/auditor#reports' },
    { name: 'Logs', href: '/dashboard/auditor#logs' },
  ],
};


