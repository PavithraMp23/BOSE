import api from '../../../lib/api';

// Helper function to get the appropriate API base path based on role
export const getApiBasePath = (role: string) => {
  const universityRoles = ['university'];
  const institutionRoles = ['institution', 'verifier', 'issuer'];

  if (universityRoles.includes(role)) {
    return '/api/university';
  } else if (institutionRoles.includes(role)) {
    return '/api/institutions';
  } else {
    return '/api/university'; // fallback
  }
};

export interface VerificationRequest {
  _id: string;
  studentId: string;
  studentName: string;
  email: string;
  certificateTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
  approvedAt?: string;
}

export interface IssuedCredential {
  _id: string;
  studentId: string;
  studentName: string;
  credentialType: string;
  issuedAt: string;
  hash: string;
  status: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  degree?: string;
  enrollmentNumber?: string;
  credentialsSummary?: {
    issued: number;
    pending: number;
  };
}

export interface AnalyticsData {
  summary: {
    totalRequests: number;
    pendingRequests: number;
    approvedCredentials: number;
    rejectedRequests: number;
    averageVerificationTimeMinutes: number;
  };
  credentialBreakdown: Array<{ type: string; count: number }>;
  monthlyStats: Array<{ month: string; issued: number }>;
  recentActivity: Array<{ action: string; student: string; date: string }>;
}

// ===== VERIFICATION REQUESTS =====
export const getVerificationRequests = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  userRole?: string
) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.append('status', status);

  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.get(`${basePath}/verification/requests?${params}`);
  return response.data;
};

export const getVerificationRequest = async (requestId: string, userRole?: string) => {
  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.get(`${basePath}/verification/requests/${requestId}`);
  return response.data;
};

export const approveCredential = async (requestId: string, data?: { fileUrl?: string; timestamp?: string }, userRole?: string) => {
  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.post(
    `${basePath}/verification/approve/${requestId}`,
    data || {}
  );
  return response.data;
};

export const rejectCredential = async (requestId: string, reason: string, userRole?: string) => {
  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.post(
    `${basePath}/verification/reject/${requestId}`,
    { reason }
  );
  return response.data;
};

// ===== ISSUED CREDENTIALS =====
export const getIssuedCredentials = async (
  page: number = 1,
  limit: number = 10,
  type?: string,
  startDate?: string,
  endDate?: string,
  userRole?: string
) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type) params.append('type', type);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.get(`${basePath}/credentials/issued?${params}`);
  return response.data;
};

export const getIssuedCredential = async (credentialId: string, userRole?: string) => {
  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.get(`${basePath}/credentials/issued/${credentialId}`);
  return response.data;
};

// ===== STUDENTS =====
export const searchStudents = async (
  page: number = 1,
  limit: number = 10,
  name?: string,
  email?: string,
  degree?: string,
  userRole?: string
) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (name) params.append('name', name);
  if (email) params.append('email', email);
  if (degree) params.append('degree', degree);

  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.get(`${basePath}/students/search?${params}`);
  return response.data;
};

// ===== ANALYTICS =====
export const getAnalytics = async (userRole?: string) => {
  const basePath = getApiBasePath(userRole || 'university');
  const response = await api.get(`${basePath}/reports/analytics`);
  return response.data;
};