import React, { useState, useRef } from 'react';
import { useUploadCredential } from '../hooks/useUploadCredential';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Upload, FileText, X, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

export default function CredentialUpload({ onUploaded }: { onUploaded?: () => void }) {
  const { upload, progress } = useUploadCredential(onUploaded);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('academic');
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or image file (PNG, JPEG)',
        variant: 'error'
      });
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 50MB',
        variant: 'error'
      });
      return;
    }

    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview('pdf');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'error'
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your credential',
        variant: 'error'
      });
      return;
    }

    try {
      await upload(file, { title, type });
      toast({
        title: 'Upload successful',
        description: 'Your credential has been uploaded and submitted for verification',
        variant: 'success'
      });
      setTitle('');
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onUploaded) onUploaded();
    } catch (e: any) {
      toast({
        title: 'Upload failed',
        description: e?.response?.data?.error || 'Please try again',
        variant: 'error'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Credential
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Credential Title <span className="text-red-500">*</span>
          </label>
          <Input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Bachelor of Science in Computer Science" 
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter a descriptive title for your credential
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Credential Type <span className="text-red-500">*</span>
          </label>
          <select 
            className="w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
            value={type} 
            onChange={e => setType(e.target.value)}
          >
            <option value="academic">Academic Degree</option>
            <option value="professional">Professional Certificate</option>
            <option value="skill">Skill Certification</option>
            <option value="achievement">Achievement Badge</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Upload File <span className="text-red-500">*</span>
          </label>
          
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                Drag & drop your credential file here, or
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Select File
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Supports PDF and image files (max 50MB)
              </p>
            </div>
          ) : (
            <div className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {filePreview === 'pdf' ? (
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                  ) : (
                    <img
                      src={filePreview || ''}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {progress != null && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300">
            Your credential will be automatically verified using AI-powered blockchain technology
          </p>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || !title.trim() || progress !== null}
          className="w-full"
          variant="gradient"
        >
          {progress !== null ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Credential
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
