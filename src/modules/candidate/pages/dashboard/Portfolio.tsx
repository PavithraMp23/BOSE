import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Download, Share2, Award, Briefcase, User, GraduationCap } from 'lucide-react';
import { CertificateItem, SkillBadge, JobHistory } from './types';

interface PortfolioProps {
    studentProfile: { name: string; role: string; email: string; program: string; enrollmentId: string };
    certificates: CertificateItem[];
    skillBadges: SkillBadge[];
    jobHistory: JobHistory[];
    onExport: () => void;
}

export default function Portfolio({
    studentProfile,
    certificates,
    skillBadges,
    jobHistory,
    onExport
}: PortfolioProps) {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex justify-between items-center border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Portfolio</h1>
                    <p className="text-slate-500 mt-1">Your comprehensive academic and professional record.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onExport}>
                        <Download className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Profile Summary Card */}
            <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-none shadow-2xl">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-slate-700">
                        {studentProfile.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold">{studentProfile.name}</h2>
                        <p className="text-slate-300 mb-4">{studentProfile.program} • {studentProfile.enrollmentId}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <span className="block text-2xl font-bold text-blue-400">{certificates.filter(c => c.status === 'verified').length}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Verified Creds</span>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <span className="block text-2xl font-bold text-purple-400">{skillBadges.length}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Skill Badges</span>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                <span className="block text-2xl font-bold text-green-400">{jobHistory.length}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Experience</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Sections */}
            <div className="grid gap-6">
                {/* Education */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><GraduationCap className="w-5 h-5 mr-2" /> Education & Certifications</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {certificates.map(cert => (
                            <div key={cert.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-bold text-slate-800">{cert.name}</h4>
                                    <p className="text-sm text-slate-600">{cert.institution}</p>
                                    <p className="text-xs text-slate-400 mt-1">{cert.issueDate}</p>
                                </div>
                                {cert.status === 'verified' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Verified</span>}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><Briefcase className="w-5 h-5 mr-2" /> Experience</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {jobHistory.map(job => (
                            <div key={job.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-bold text-slate-800">{job.title}</h4>
                                    <p className="text-sm text-slate-600">{job.company}</p>
                                    <p className="text-xs text-slate-400 mt-1">{job.startDate} - {job.endDate}</p>
                                    <p className="text-sm text-slate-500 mt-2">{job.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><Award className="w-5 h-5 mr-2" /> Skills</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {skillBadges.map(skill => (
                                <span key={skill.id} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                                    {skill.name} <span className="text-slate-400 ml-1 text-xs">({skill.level})</span>
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
