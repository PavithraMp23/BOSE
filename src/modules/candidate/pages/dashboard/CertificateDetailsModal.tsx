import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { CheckCircle, Calendar, Building2, Share2, Download, ExternalLink } from 'lucide-react';
import { CertificateItem } from './types';

interface CertificateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    certificate: CertificateItem | null;
    onShare: () => void;
}

export default function CertificateDetailsModal({ isOpen, onClose, certificate, onShare }: CertificateDetailsModalProps) {
    if (!certificate) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg overflow-hidden border-0 p-0 shadow-2xl rounded-2xl">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 -mt-12 relative z-10">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{certificate.name}</h2>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    <Building2 className="w-4 h-4" /> {certificate.institution}
                                </p>
                            </div>
                            {certificate.grade && (
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold font-mono text-lg border border-blue-100">
                                    {certificate.grade}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
                                <p className="text-slate-700 font-semibold flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" /> {certificate.issueDate || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Status</p>
                                <p className="text-green-700 font-bold flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Verified
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-800 mb-2">Blockchain Verification</h4>
                            <div className="text-xs font-mono text-slate-500 break-all bg-slate-50 p-2 rounded border border-slate-200">
                                0x8f2a5...3b9c1 • Verified by {certificate.verifiedBy || 'Consortium'}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200/50" onClick={onShare}>
                                <Share2 className="w-4 h-4 mr-2" /> Share
                            </Button>
                            <Button variant="outline" className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50">
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
