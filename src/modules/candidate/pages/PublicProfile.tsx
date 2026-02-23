import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Shield, Award, Briefcase, GraduationCap, CheckCircle, Mail, MapPin, Phone, Calendar, Star, TrendingUp, Download } from 'lucide-react';
import api from '../../../lib/api';

interface Credential {
    _id: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialType: string;
    verified: boolean;
    blockchainHash?: string;
    description?: string;
}

interface PublicProfileData {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    profileImage?: string;
    credentials: Credential[];
    skills: Array<{ name: string; level: number; category?: string }>;
    education: Array<{ institution: string; degree: string; year: string; gpa?: string; honors?: string }>;
    experience: Array<{ company: string; role: string; duration: string; description?: string; achievements?: string[] }>;
    certifications?: Array<{ name: string; issuer: string; date: string }>;
    languages?: Array<{ name: string; proficiency: string }>;
    achievements?: string[];
}

export default function PublicProfile() {
    const { userId } = useParams<{ userId: string }>();
    const [profile, setProfile] = useState<PublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicProfile = async () => {
            try {
                setLoading(true);
                // Note: api.get already adds /api prefix, so we just need /public/profile
                const response = await api.get(`/public/profile/${userId}`);
                setProfile(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load profile');
                console.error('Public profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchPublicProfile();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading professional profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <Card className="max-w-md shadow-2xl">
                    <CardContent className="pt-6 text-center">
                        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                        <p className="text-gray-600">{error || 'This profile does not exist or is not publicly available.'}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header with BOSE Branding */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                            BOSE Verified Profile
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600">Blockchain-verified professional credentials</p>
                </div>

                {/* Main Resume Card */}
                <Card className="shadow-2xl border-2 border-blue-100 overflow-hidden">
                    {/* Profile Header - Resume Style */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Profile Picture / Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl">
                                    {profile.profileImage ? (
                                        <img src={profile.profileImage} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold text-white">{getInitials(profile.name)}</span>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            {/* Name and Contact Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">{profile.name}</h1>
                                <p className="text-xl text-blue-100 mb-4">{profile.bio || 'Blockchain-Verified Professional'}</p>

                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        <Mail className="h-4 w-4" />
                                        <span>{profile.email}</span>
                                    </div>
                                    {profile.phone && (
                                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            <Phone className="h-4 w-4" />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                    {profile.location && (
                                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            <MapPin className="h-4 w-4" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Download Resume Button */}
                            <div className="flex flex-col gap-2">
                                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Download Resume
                                </button>
                                <div className="text-center text-xs text-blue-100">
                                    <CheckCircle className="h-3 w-3 inline mr-1" />
                                    Blockchain Verified
                                </div>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-8 space-y-8">
                        {/* Professional Summary */}
                        {profile.bio && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star className="h-6 w-6 text-yellow-500" />
                                    Professional Summary
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
                            </div>
                        )}

                        {/* Verified Credentials - Prominent */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Award className="h-6 w-6 text-blue-600" />
                                Blockchain-Verified Credentials
                                <span className="ml-auto text-sm font-normal text-gray-500">
                                    {profile.credentials.length} credential{profile.credentials.length !== 1 ? 's' : ''}
                                </span>
                            </h2>
                            {profile.credentials.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No credentials available</p>
                            ) : (
                                <div className="grid gap-4">
                                    {profile.credentials.map((credential) => (
                                        <div
                                            key={credential._id}
                                            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Award className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {credential.title}
                                                            </h3>
                                                            <p className="text-gray-600 font-medium mt-1">{credential.issuer}</p>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="h-4 w-4" />
                                                                    {new Date(credential.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                                </span>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                                                    {credential.credentialType}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {credential.description && (
                                                        <p className="text-gray-600 mt-3 leading-relaxed">{credential.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border-2 border-green-300 shadow-sm">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        VERIFIED
                                                    </span>
                                                </div>
                                            </div>
                                            {credential.blockchainHash && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Shield className="h-4 w-4 text-blue-600" />
                                                        <span className="text-gray-500">Blockchain Hash:</span>
                                                        <code className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                            {credential.blockchainHash.substring(0, 24)}...
                                                        </code>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Skills Section - Visual Progress Bars */}
                        {profile.skills && profile.skills.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                    Skills & Expertise
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {profile.skills.map((skill, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-900 text-lg">{skill.name}</span>
                                                <span className="text-sm font-bold text-blue-600">{skill.level}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                <div
                                                    className="h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-600 to-green-500"
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                            </div>
                                            {skill.category && (
                                                <span className="text-xs text-gray-500 italic">{skill.category}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Work Experience - Detailed */}
                        {profile.experience && profile.experience.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Briefcase className="h-6 w-6 text-orange-600" />
                                    Professional Experience
                                </h2>
                                <div className="space-y-6">
                                    {profile.experience.map((exp, index) => (
                                        <div key={index} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
                                            <div className="absolute -left-3 top-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                                <Briefcase className="h-3 w-3 text-white" />
                                            </div>
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                                                <p className="text-lg text-blue-600 font-semibold mt-1">{exp.company}</p>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {exp.duration}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                                                )}
                                                {exp.achievements && exp.achievements.length > 0 && (
                                                    <ul className="mt-4 space-y-2">
                                                        {exp.achievements.map((achievement, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>{achievement}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education - Academic Background */}
                        {profile.education && profile.education.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <GraduationCap className="h-6 w-6 text-purple-600" />
                                    Education
                                </h2>
                                <div className="grid gap-4">
                                    {profile.education.map((edu, index) => (
                                        <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <GraduationCap className="h-7 w-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                                                <p className="text-lg text-purple-600 font-semibold mt-1">{edu.institution}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {edu.year}
                                                    </span>
                                                    {edu.gpa && (
                                                        <span className="font-semibold">GPA: {edu.gpa}</span>
                                                    )}
                                                    {edu.honors && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                                                            <Star className="h-3 w-3 mr-1" />
                                                            {edu.honors}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Sections */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Languages */}
                            {profile.languages && profile.languages.length > 0 && (
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
                                    <div className="space-y-3">
                                        {profile.languages.map((lang, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="font-medium text-gray-900">{lang.name}</span>
                                                <span className="text-sm px-3 py-1 bg-white rounded-full border border-blue-300 text-blue-700 font-medium">
                                                    {lang.proficiency}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Achievements */}
                            {profile.achievements && profile.achievements.length > 0 && (
                                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-yellow-600" />
                                        Key Achievements
                                    </h3>
                                    <ul className="space-y-2">
                                        {profile.achievements.map((achievement, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                                <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                <span>{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 pb-4">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Verified by BOSE - Blockchain Credential Platform</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        All credentials are cryptographically verified and immutably stored on the blockchain
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
