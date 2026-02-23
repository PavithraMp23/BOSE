import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardTitle } from '../../../../components/ui/card';
import {
    Award,
    MapPin,
    Calendar,
    CheckCircle,
    Share2,
    Clock,
    Briefcase
} from 'lucide-react';
import { CertificateItem, JobHistory, SkillBadge } from './types';

interface DashboardHomeProps {
    certificates: CertificateItem[];
    jobHistory: JobHistory[];
    skillBadges: SkillBadge[];
    onViewCertificateRequest: (cert: CertificateItem) => void;
    onShareOpen: () => void;
}

export default function DashboardHome({
    certificates,
    jobHistory,
    skillBadges,
    onViewCertificateRequest,
    onShareOpen
}: DashboardHomeProps) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your credentials.</p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
                    onClick={onShareOpen}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                </Button>
            </div>

            {/* Verified Credits Timeline */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Verified Credits
                </h2>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {certificates.map((cert, i) => (
                        <div key={cert.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            {/* Card */}
                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-slate-800 text-lg">{cert.name}</div>
                                    <time className="font-caveat font-medium text-blue-500">{cert.grade}</time>
                                </div>
                                <div className="text-slate-500 text-sm mb-3">
                                    {cert.institution} • {cert.issueDate}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {cert.skills.map((skill, skIndex) => (
                                            <div key={skIndex} className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] text-blue-600 font-bold" title={skill}>
                                                {skill[0]}
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => onViewCertificateRequest(cert)}>
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* Job History */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                    Job History
                </h2>
                <div className="grid gap-4">
                    {jobHistory.map((job) => (
                        <Card key={job.id} className="bg-white border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                                    <p className="text-slate-600 flex items-center mt-1">
                                        <Briefcase className="w-4 h-4 mr-1 text-slate-400" /> {job.company}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" /> {job.startDate} - {job.endDate}
                                    </p>
                                </div>
                                {job.verified && (
                                    <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Verified by {job.verifiedBy}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Skill Badges */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-orange-500" />
                    Skill Badges
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {skillBadges.map((badge) => (
                        <div key={badge.id} className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${badge.level === 'expert' ? 'from-yellow-400 to-orange-500' :
                                    badge.level === 'advanced' ? 'from-blue-400 to-indigo-500' :
                                        'from-slate-300 to-slate-400'
                                } rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500`}></div>
                            <Card className="relative bg-white border-none shadow-md h-full flex flex-col items-center justify-center p-6 text-center hover:transform hover:-translate-y-1 transition-all">
                                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-gradient-to-br ${badge.level === 'expert' ? 'from-yellow-100 to-orange-100 text-orange-600' :
                                        badge.level === 'advanced' ? 'from-blue-100 to-indigo-100 text-blue-600' :
                                            'from-slate-100 to-slate-200 text-slate-600'
                                    }`}>
                                    <Award className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-800">{badge.name}</h3>
                                <p className="text-xs text-slate-500 capitalize">{badge.level}</p>
                                {badge.verified && (
                                    <div className="mt-2 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
