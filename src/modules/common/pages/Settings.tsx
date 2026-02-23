import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
    User,
    Shield,
    Bell,
    Lock,
    Settings as SettingsIcon,
    Network,
    Key,
    Database
} from 'lucide-react';

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account and blockchain network preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile
                        </CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <Input value={user?.name || ''} disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input value={user?.email || ''} disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Role</label>
                            <Input value={user?.role || ''} disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Organization</label>
                            <Input value={user?.organization || ''} disabled />
                        </div>
                        <Button variant="outline" className="w-full">
                            Update Profile
                        </Button>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security
                        </CardTitle>
                        <CardDescription>Manage your security preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Current Password</label>
                            <Input type="password" placeholder="Enter current password" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <Input type="password" placeholder="Enter new password" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <Input type="password" placeholder="Confirm new password" />
                        </div>
                        <Button className="w-full">
                            Change Password
                        </Button>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Configure your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Credential Events</div>
                                <div className="text-sm text-gray-500">New issuance, verification, revocation</div>
                            </div>
                            <input type="checkbox" className="h-4 w-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">System Alerts</div>
                                <div className="text-sm text-gray-500">Network status, errors</div>
                            </div>
                            <input type="checkbox" className="h-4 w-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Weekly Reports</div>
                                <div className="text-sm text-gray-500">Analytics summary</div>
                            </div>
                            <input type="checkbox" className="h-4 w-4" />
                        </div>
                        <Button variant="outline" className="w-full">
                            Save Preferences
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Blockchain Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        Blockchain Configuration
                    </CardTitle>
                    <CardDescription>Your Hyperledger Fabric network settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                MSP Identity
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">MSP ID:</span>
                                    <span className="font-mono">{user?.organization}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Certificate Status:</span>
                                    <span className="text-green-600 font-medium">Valid</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Expiry:</span>
                                    <span>Dec 31, 2024</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="mt-4">
                                View Certificate
                            </Button>
                        </div>

                        <div>
                            <h3 className="font-medium mb-4 flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Network Access
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Channel Access:</span>
                                    <span className="font-mono">mychannel</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chaincode:</span>
                                    <span className="font-mono">cred</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Peer Connection:</span>
                                    <span className="text-green-600 font-medium">Connected</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="mt-4">
                                Test Connection
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Keys & Integration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        API Access & Integration
                    </CardTitle>
                    <CardDescription>Manage API keys and third-party integrations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">API Key</label>
                            <div className="flex gap-2 mt-1">
                                <Input value="sk_live_..." disabled className="font-mono" />
                                <Button variant="outline">Regenerate</Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Use this key to access BOSE APIs programmatically
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Future Integrations (Coming Soon)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg opacity-50">
                                    <h5 className="font-medium">AI Fraud Detection</h5>
                                    <p className="text-sm text-gray-500">Automated anomaly detection for credentials</p>
                                </div>
                                <div className="p-4 border rounded-lg opacity-50">
                                    <h5 className="font-medium">Cross-Chain Bridge</h5>
                                    <p className="text-sm text-gray-500">Connect to other blockchain networks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
