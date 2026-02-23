import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Copy, Download, Check, Share2 } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
}

export default function QRCodeModal({ isOpen, onClose, userId, userName }: QRCodeModalProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Generate the public profile URL
    const profileUrl = `${window.location.origin}/profile/${userId}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            toast({
                title: 'Link Copied!',
                description: 'Profile link copied to clipboard',
                variant: 'success'
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: 'Copy Failed',
                description: 'Failed to copy link to clipboard',
                variant: 'error'
            });
        }
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${userName.replace(/\s+/g, '_')}_QR_Code.png`;
                    link.click();
                    URL.revokeObjectURL(url);

                    toast({
                        title: 'QR Code Downloaded!',
                        description: 'Your QR code has been saved',
                        variant: 'success'
                    });
                }
            });
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-blue-600" />
                        Share Your Profile
                    </DialogTitle>
                    <DialogDescription>
                        Share your verified credentials with recruiters and judges
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* QR Code Display */}
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={profileUrl}
                            size={200}
                            level="H"
                            includeMargin={true}
                            className="mb-4"
                        />
                        <p className="text-sm text-gray-600 text-center">
                            Scan this QR code to view {userName}'s verified profile
                        </p>
                    </div>

                    {/* Shareable Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Shareable Link
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={profileUrl}
                                readOnly
                                className="font-mono text-sm"
                                onClick={(e) => e.currentTarget.select()}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyLink}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleDownloadQR}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download QR Code
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Close
                        </Button>
                    </div>

                    {/* Info Note */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Your public profile will display only verified credentials and information you've chosen to share. Judges can view your credentials without needing to log in.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
