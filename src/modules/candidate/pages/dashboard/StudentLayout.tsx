import React from 'react';
import {
    BarChart3,
    Upload,
    FileCheck,
    Share2,
    Briefcase,
    TrendingUp,
    LogOut,
    User,
    Menu,
    X
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { DashboardSection } from './types';

interface StudentLayoutProps {
    children: React.ReactNode;
    activeSection: DashboardSection;
    setActiveSection: (section: DashboardSection) => void;
    studentProfile: { name: string; role: string };
    onLogout: () => void;
}

export default function StudentLayout({
    children,
    activeSection,
    setActiveSection,
    studentProfile,
    onLogout
}: StudentLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    // Sidebar link configuration
    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'upload', label: 'Upload Credits', icon: Upload },
        { id: 'portfolio', label: 'My Portfolio', icon: FileCheck },
        { id: 'share', label: 'Share Credentials', icon: Share2 },
        { id: 'recommendations', label: 'Recommendations', icon: Briefcase },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl`}
            >
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BOSE</h1>
                        <p className="text-xs text-slate-400 mt-1">Student Portal</p>
                    </div>
                    <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = activeSection === link.id;
                        return (
                            <button
                                key={link.id}
                                onClick={() => {
                                    setActiveSection(link.id as DashboardSection);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-200' : ''}`} />
                                <span className="font-medium">{link.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                            {studentProfile.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{studentProfile.name}</p>
                            <p className="text-xs text-slate-400">{studentProfile.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={onLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-40">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-slate-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-slate-800">BOSE Student</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
