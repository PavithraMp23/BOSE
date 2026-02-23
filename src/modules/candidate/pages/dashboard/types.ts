import { LucideIcon } from 'lucide-react';

export type DashboardSection = 'dashboard' | 'upload' | 'portfolio' | 'share' | 'recommendations' | 'analytics';

export interface CertificateItem {
    id: string;
    name: string;
    fileName: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: string;
    verifiedBy?: string;
    verifiedAt?: string;
    type: 'degree' | 'certification' | 'course';
    institution: string;
    grade?: string;
    issueDate?: string;
    skills: string[];
    description?: string;
}

export interface SkillBadge {
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
}

export interface JobHistory {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    skills: string[];
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
}
