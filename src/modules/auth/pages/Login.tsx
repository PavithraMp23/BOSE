import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

export default function Login() {
    const { user, login, loading } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Demo accounts for easy access (MongoDB seeded accounts)
    const demoAccounts = [
        { email: 'alice.johnson@student.edu', role: 'Student', org: 'Alice Johnson', color: 'blue', description: 'Has 2 verified credentials' },
        { email: 'hr@google.com', role: 'Recruiter', org: 'Google LLC', color: 'purple', description: 'Posted 3 active jobs' },
        { email: 'registrar@mit.edu', role: 'Institution', org: 'MIT', color: 'green', description: 'Issued 2 credentials' },
        { email: 'admin@bose.edu', role: 'Admin', org: 'System Administrator', color: 'red', description: 'Full system access' },
        { email: 'verifier@bose.edu', role: 'Verifier', org: 'Credential Verifier', color: 'orange', description: 'Verify credentials' },
        { email: 'michael.auditor@gov.edu', role: 'Auditor', org: 'Government Auditor', color: 'gray', description: 'Audit system activities' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (user) {
        // Redirect based on user role
        const role = user.role?.toLowerCase();
        if (role === 'student' || role === 'candidate') {
            return <Navigate to="/dashboard/student" replace />;
        } else if (role === 'admin') {
            return <Navigate to="/dashboard/admin" replace />;
        } else if (role === 'employer' || role === 'recruiter') {
            return <Navigate to="/dashboard/employer" replace />;
        } else if (role === 'institution' || role === 'verifier') {
            return <Navigate to="/dashboard/institution" replace />;
        } else if (role === 'auditor') {
            return <Navigate to="/dashboard/auditor" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            toast({
                title: 'Welcome to BOSE!',
                description: 'Successfully logged in to the blockchain platform',
                variant: 'success'
            });
        } catch (error: any) {
            toast({
                title: 'Login Failed',
                description: error.response?.data?.error || 'Invalid credentials',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password123'); // MongoDB seeded accounts use 'password123'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Back to landing */}
                <div className="mb-6">
                    <Link to="/" className="text-blue-300 hover:text-blue-200 flex items-center gap-2 text-sm transition-colors duration-200 hover:scale-105">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-gray-200/50 dark:border-gray-700/50">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
                                    <Shield className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">BOSE</h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Blockchain Credentials</p>
                                </div>
                            </div>
                        </div>
                        <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center text-base">
                            Sign in to access the Hyperledger Fabric credential network
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Signing In...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {demoAccounts.map((account) => {
                                const colorStyles = {
                                    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700' },
                                    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700' },
                                    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700' },
                                    red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
                                    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700' },
                                    gray: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' }
                                }[account.color as string] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' };

                                return (
                                    <button
                                        key={account.email}
                                        onClick={() => handleDemoLogin(account.email)}
                                        className="group relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 text-left hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="w-full space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {account.role}
                                                </div>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colorStyles.bg} ${colorStyles.text} border ${colorStyles.border}`}>
                                                    {account.org}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">{account.description}</div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded">
                                                {account.email}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="text-xs text-center text-gray-500 space-y-1">
                            <div>All demo accounts use password: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">password123</code></div>
                            <div className="text-gray-400">Click any account above to auto-fill credentials</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-blue-200/80 dark:text-blue-300/80 flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Secured by Hyperledger Fabric • MSP Identity Management</span>
                </div>
            </div>
        </div>
    );
}
