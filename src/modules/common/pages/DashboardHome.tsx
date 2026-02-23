import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
    Shield,
    FileText,
    CheckCircle,
    AlertTriangle,
    Activity,
    Users,
    TrendingUp,
    Clock
} from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import RecruiterDashboard from '../../recruiter/RecruiterDashboard';

export default function DashboardHome() {
    const { user } = useAuth();
    const { messages, connectionStatus } = useWebSocket('ws://localhost:3002');
    const [stats, setStats] = useState({
        totalCredentials: 0,
        activeCredentials: 0,
        revokedCredentials: 0,
        recentActivity: 0
    });

    useEffect(() => {
        // Fetch dashboard stats
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // Simulated stats - in production, fetch from API
            setStats({
                totalCredentials: 1247,
                activeCredentials: 1198,
                revokedCredentials: 49,
                recentActivity: messages.length
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const renderRoleSpecificContent = () => {
        switch (user?.role) {
            case 'student':
                return <StudentDashboard user={user} />;
            case 'employer':
                return <RecruiterDashboard />;
            case 'verifier':
                return <VerifierDashboard user={user} />;
            case 'auditor':
                return <AuditorDashboard user={user} stats={stats} />;
            default:
                return <DefaultDashboard />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name}
                </h1>
                <p className="text-gray-600 mt-2">
                    {user?.organization ?? '—'} • {(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Guest')} Access
                </p>
            </div>

            {/* Network Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Network Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">Online</div>
                            <div className="text-sm text-gray-500">Fabric Network</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">3</div>
                            <div className="text-sm text-gray-500">Active Orgs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">mychannel</div>
                            <div className="text-sm text-gray-500">Current Channel</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                            </div>
                            <div className="text-sm text-gray-500">Real-time Events</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Role-specific content */}
            {renderRoleSpecificContent()}

            {/* Recent Events */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Network Events
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {messages.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {messages.slice(0, 10).map((message, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <div>
                                            <p className="font-medium text-sm">{message.eventName || message.type}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                    {message.data && (
                                        <div className="text-xs text-gray-600">
                                            {JSON.stringify(message.data).substring(0, 50)}...
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No recent events</p>
                            <p className="text-sm">Connect to WebSocket to see real-time updates</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StudentDashboard({ user }: { user: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        My Credentials
                    </CardTitle>
                    <CardDescription>View and verify your issued credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>Total Credentials</span>
                            <span className="font-bold">3</span>
                        </div>
                        <Button className="w-full">View My Credentials</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Request New Credential
                    </CardTitle>
                    <CardDescription>Submit request for credential issuance</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full">Submit Request</Button>
                </CardContent>
            </Card>
        </div>
    );
}

function VerifierDashboard({ user }: { user: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Verify Credential
                    </CardTitle>
                    <CardDescription>Cross-verify credentials with private channels</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">Start Verification</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Audit Trail
                    </CardTitle>
                    <CardDescription>Real-time verification event feed</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full">View Audit Log</Button>
                </CardContent>
            </Card>
        </div>
    );
}

function AuditorDashboard({ user, stats }: { user: any; stats: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCredentials.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Network-wide</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.activeCredentials.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {((stats.activeCredentials / stats.totalCredentials) * 100).toFixed(1)}% of total
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revoked</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.revokedCredentials}</div>
                    <p className="text-xs text-muted-foreground">
                        {((stats.revokedCredentials / stats.totalCredentials) * 100).toFixed(1)}% of total
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Live Events</CardTitle>
                    <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.recentActivity}</div>
                    <p className="text-xs text-muted-foreground">Last hour</p>
                </CardContent>
            </Card>
        </div>
    );
}

function DefaultDashboard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Welcome to the BOSE platform</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Select a role-specific view from the navigation menu.</p>
            </CardContent>
        </Card>
    );
}
