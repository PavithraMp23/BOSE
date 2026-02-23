import React, { useState, useEffect } from 'react';
import { Upload, X, Shield, Search, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { useToast } from '../../../../components/ui/toast';
import api from '../../../../lib/api';

interface UploadCreditsProps {
    onUploadSuccess: () => void;
}

export default function UploadCredits({ onUploadSuccess }: UploadCreditsProps) {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);

    // Form State
    const [certificateDetails, setCertificateDetails] = useState({
        name: '',
        type: 'certification',
        institutionId: '',
        issueDate: '',
        description: '',
        publicShare: true,
        verificationShare: true
    });

    useEffect(() => {
        // List institutions for dropdown
        api.get('/api/institutions')
            .then(res => setInstitutions(res.data || []))
            .catch(err => console.error(err));
    }, []);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
            toast({ title: "Invalid file type", description: "Please upload a PDF or Image file.", variant: "error" });
            return;
        }
        // Validate size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max file size is 50MB.", variant: "error" });
            return;
        }

        setSelectedFile(file);
        // Auto-fill name if empty
        if (!certificateDetails.name) {
            setCertificateDetails(prev => ({ ...prev, name: file.name.split('.')[0] }));
        }
        setUploadModalOpen(true);
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', certificateDetails.name);
        formData.append('type', certificateDetails.type);
        formData.append('institutionId', certificateDetails.institutionId || 'manual');
        formData.append('issueDate', certificateDetails.issueDate);
        formData.append('description', certificateDetails.description);

        try {
            await api.post('/api/credentials/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast({ title: "Upload Successful", description: "Your credential has been submitted for verification.", variant: "success" });
            setUploadModalOpen(false);
            setSelectedFile(null);
            setCertificateDetails({
                name: '', type: 'certification', institutionId: '', issueDate: '', description: '', publicShare: true, verificationShare: true
            });
            onUploadSuccess();
        } catch (error) {
            toast({ title: "Upload Failed", description: "Could not upload file. Please try again.", variant: "error" });
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Upload Credits</h1>
            <Card className="border-2 border-dashed border-slate-300 bg-slate-50 min-h-[400px] flex flex-col items-center justify-center text-center p-12 hover:bg-slate-100 transition-colors"
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                {dragActive ? (
                    <div className="pointer-events-none animate-pulse">
                        <Upload className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                        <p className="text-xl font-bold text-blue-600">Drop file here...</p>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <Upload className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Drag & Drop your certificate</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                            Supports PDF, JPG, PNG (Max 50MB). We'll analyze it for verification.
                        </p>
                        <div className="relative">
                            <input type="file" id="file-upload" className="hidden" onChange={handleChange} accept=".pdf,image/*" />
                            <label htmlFor="file-upload">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg shadow-blue-200 cursor-pointer pointer-events-auto" asChild>
                                    <span><FileText className="w-5 h-5 mr-2" /> Browse Files</span>
                                </Button>
                            </label>
                        </div>
                    </>
                )}
            </Card>

            {/* Upload Modal - Custom basic implementation or use Dialog from UI - sticking to inline state if easier, but Dialog is better */}
            {uploadModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg bg-white shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
                            <CardTitle>Verify & Submit</CardTitle>
                            <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-red-500"><X /></button>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="bg-slate-50 p-3 rounded-lg flex items-center mb-4">
                                <FileText className="w-8 h-8 text-blue-500 mr-3" />
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate">{selectedFile?.name}</p>
                                    <p className="text-xs text-slate-500">{(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Certificate Name</label>
                                    <Input
                                        value={certificateDetails.name}
                                        onChange={e => setCertificateDetails({ ...certificateDetails, name: e.target.value })}
                                        placeholder="e.g. Advanced React Pattern"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Type</label>
                                        <select
                                            className="w-full mt-1 p-2 border rounded-md"
                                            value={certificateDetails.type}
                                            onChange={e => setCertificateDetails({ ...certificateDetails, type: e.target.value })}
                                        >
                                            <option value="certification">Certification</option>
                                            <option value="degree">Degree</option>
                                            <option value="course">Course Completion</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Issue Date</label>
                                        <Input
                                            type="date"
                                            value={certificateDetails.issueDate}
                                            onChange={e => setCertificateDetails({ ...certificateDetails, issueDate: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Verifying Institution</label>
                                    <select
                                        className="w-full mt-1 p-2 border rounded-md"
                                        value={certificateDetails.institutionId}
                                        onChange={e => setCertificateDetails({ ...certificateDetails, institutionId: e.target.value })}
                                    >
                                        <option value="">Select Institution...</option>
                                        {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                                        <option value="manual">Other (Manual Verification)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-6 space-y-3">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={certificateDetails.verificationShare}
                                        onChange={e => setCertificateDetails({ ...certificateDetails, verificationShare: e.target.checked })}
                                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-slate-600">
                                        I verify that this is a valid document and I consent to share it with the selected institution for verification purposes.
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" className="flex-1" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUploadSubmit}>
                                    <Shield className="w-4 h-4 mr-2" /> Submit for Verification
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
