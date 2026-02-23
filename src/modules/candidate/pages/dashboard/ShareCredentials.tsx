import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Share2, Copy, QrCode, Smartphone, Globe, Clock, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../components/ui/dialog';
import QRCodeModal from '../../components/QRCodeModal';
import { useAuth } from '../../../../contexts/AuthContext';

interface ShareCredentialsProps {
    userName: string;
}

export default function ShareCredentials({ userName }: ShareCredentialsProps) {
    const { user } = useAuth();
    const [shareLink, setShareLink] = useState(`https://bose.edu/verify/${userName.toLowerCase().replace(/\s/g, '')}-12345`);
    const [modalOpen, setModalOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [shareConfig, setShareConfig] = useState({ expiry: '24h', scope: 'full' });

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        // In a real app, use toast here. Since toast is not passed, rely on parent or local state for feedback if needed.
        // Assuming user will see visual feedback or we can add a simple "Copied!" state.
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Share Credentials</h1>
                <p className="text-slate-500 mt-1">Securely share your verified achievements with employers or institutions.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Quick Link Share */}
                <Card className="md:col-span-2 shadow-lg border-blue-100">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Globe className="w-5 h-5 mr-2 text-blue-500" /> Public Link</CardTitle>
                        <CardDescription>Anyone with this link can view your verified portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex space-x-2">
                            <Input value={shareLink} readOnly className="bg-slate-50 font-mono text-sm" />
                            <Button variant="outline" onClick={copyToClipboard}><Copy className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                <Share2 className="w-4 h-4 mr-2" /> Share Options
                            </Button>
                            <Button
                                variant="outline"
                                className="text-slate-600"
                                onClick={() => setQrModalOpen(true)}
                            >
                                <QrCode className="w-4 h-4 mr-2" /> QR Code
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* NFC Share */}
                <Card className="shadow-lg border-purple-100 bg-gradient-to-br from-white to-purple-50">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Smartphone className="w-5 h-5 mr-2 text-purple-500" /> NFC Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Share2 className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Bring device close to share instantly</p>
                        <Button variant="ghost" className="mt-4 text-purple-600 hover:text-purple-700 hover:bg-purple-100">Activate NFC</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Share History / Active Links */}
            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Active Shares</h3>
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Recruiter Link #{i}</p>
                                <p className="text-xs text-slate-500 flex items-center mt-1">
                                    <Clock className="w-3 h-3 mr-1" /> Expires in 12 hours
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">Active</span>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Revoke</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Share Configuration Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configure Share Link</DialogTitle>
                        <DialogDescription>Set expiration and access scope for this link.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Expiration</label>
                            <div className="flex gap-2">
                                {['1h', '24h', '7d', 'Never'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setShareConfig({ ...shareConfig, expiry: opt })}
                                        className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${shareConfig.expiry === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Access Scope</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShareConfig({ ...shareConfig, scope: 'full' })}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm border text-center ${shareConfig.scope === 'full' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                                >
                                    Full Portfolio
                                </button>
                                <button
                                    onClick={() => setShareConfig({ ...shareConfig, scope: 'partial' })}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm border text-center ${shareConfig.scope === 'partial' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                                >
                                    Verified Only
                                </button>
                            </div>
                        </div>
                    </div>
                    <Button className="w-full bg-blue-600 text-white" onClick={() => setModalOpen(false)}>Generate Link</Button>
                </DialogContent>
            </Dialog>

            {/* QR Code Modal */}
            <QRCodeModal
                isOpen={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                userId={user?.id || ''}
                userName={userName}
            />
        </div>
    );
}
