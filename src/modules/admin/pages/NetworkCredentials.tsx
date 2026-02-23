import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useFabricTx } from '../../../hooks/useFabricTx';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { useToast } from '../../../components/ui/toast';
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  X,
  Eye,
  Hash,
  Calendar,
  Building
} from 'lucide-react';
import { formatDate, truncateHash, getStatusColor } from '../../../lib/utils';
import { useStore } from '../../../store/useStore';

interface Credential {
  credentialId: string;
  studentId: string;
  dataHash: string;
  issuer: string;
  issuedAt: string;
  status: string;
}

export default function Credentials() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { submitTransaction, evaluateTransaction, loading } = useFabricTx();
  const { credentials, setCredentials } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  // Issue credential form state
  const [issueForm, setIssueForm] = useState({
    studentId: '',
    dataHash: '',
    credentialType: 'academic'
  });

  // Verify credential form state
  const [verifyForm, setVerifyForm] = useState({
    credentialId: '',
    dataHash: ''
  });

  useEffect(() => {
    loadCredentials();
  }, [user]);

  const loadCredentials = async () => {
    try {
      let result;

      if (user?.role === 'student') {
        result = await evaluateTransaction(`credentials/student/${user.id}`);
      } else if (user?.role === 'auditor') {
        result = await evaluateTransaction('credentials');
      } else {
        result = await evaluateTransaction('credentials', { limit: 50 });
      }

      if (result.success) {
        setCredentials(result.data.credentials || []);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      toast({
        title: 'Error',
        description: 'Failed to load credentials',
        variant: 'error'
      });
    }
  };

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueForm.studentId || !issueForm.dataHash) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'error'
      });
      return;
    }

    try {
      const result = await submitTransaction('credentials/issue', issueForm);

      if (result.success) {
        toast({
          title: 'Credential Issued Successfully',
          description: `Credential ${result.data.credentialId} has been issued`,
          variant: 'success'
        });
        setIssueForm({ studentId: '', dataHash: '', credentialType: 'academic' });
        loadCredentials();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Issuance Failed',
        description: error.message || 'Failed to issue credential',
        variant: 'error'
      });
    }
  };

  const handleVerifyCredential = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verifyForm.credentialId || !verifyForm.dataHash) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'error'
      });
      return;
    }

    try {
      const result = await submitTransaction('credentials/verify', verifyForm);

      if (result.success) {
        toast({
          title: result.data.valid ? 'Credential Valid' : 'Credential Invalid',
          description: result.data.reason,
          variant: result.data.valid ? 'success' : 'error'
        });
        setVerifyForm({ credentialId: '', dataHash: '' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Failed to verify credential',
        variant: 'error'
      });
    }
  };

  const handleRevokeCredential = async (credentialId: string) => {
    if (!confirm('Are you sure you want to revoke this credential?')) {
      return;
    }

    try {
      const result = await submitTransaction('credentials/revoke', {
        credentialId,
        reason: 'Administrative revocation'
      });

      if (result.success) {
        toast({
          title: 'Credential Revoked',
          description: 'The credential has been successfully revoked',
          variant: 'success'
        });
        loadCredentials();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Revocation Failed',
        description: error.message || 'Failed to revoke credential',
        variant: 'error'
      });
    }
  };

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch =
      cred.credentialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || cred.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const canIssue = ['employer', 'auditor'].includes(user?.role || '');
  const canVerify = ['verifier', 'employer', 'auditor'].includes(user?.role || '');
  const canRevoke = user?.role === 'auditor';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credentials</h1>
          <p className="text-gray-600">Manage blockchain credentials and verification</p>
        </div>

        <div className="flex gap-2">
          {canVerify && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verify Credential</DialogTitle>
                  <DialogDescription>
                    Verify a credential by providing its ID and expected data hash
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleVerifyCredential} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Credential ID</label>
                    <Input
                      value={verifyForm.credentialId}
                      onChange={(e) => setVerifyForm(prev => ({ ...prev, credentialId: e.target.value }))}
                      placeholder="Enter credential ID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data Hash</label>
                    <Input
                      value={verifyForm.dataHash}
                      onChange={(e) => setVerifyForm(prev => ({ ...prev, dataHash: e.target.value }))}
                      placeholder="Enter expected data hash"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Verifying...' : 'Verify Credential'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {canIssue && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Issue Credential
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Issue New Credential</DialogTitle>
                  <DialogDescription>
                    Create a new credential on the blockchain network
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleIssueCredential} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Student ID</label>
                    <Input
                      value={issueForm.studentId}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, studentId: e.target.value }))}
                      placeholder="Enter student ID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data Hash</label>
                    <Input
                      value={issueForm.dataHash}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, dataHash: e.target.value }))}
                      placeholder="Enter credential data hash"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Credential Type</label>
                    <select
                      className="w-full p-2 border border-gray-200 rounded-md"
                      value={issueForm.credentialType}
                      onChange={(e) => setIssueForm(prev => ({ ...prev, credentialType: e.target.value }))}
                    >
                      <option value="academic">Academic Degree</option>
                      <option value="professional">Professional Certificate</option>
                      <option value="training">Training Completion</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Issuing...' : 'Issue Credential'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search credentials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-200 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
              </select>
              <Button variant="outline" onClick={loadCredentials}>
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials List */}
      <div className="grid gap-4">
        {filteredCredentials.length > 0 ? (
          filteredCredentials.map((credential) => (
            <Card key={credential.credentialId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{credential.credentialId}</h3>
                      <p className="text-sm text-gray-500">Student: {credential.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credential.status)}`}>
                      {credential.status}
                    </span>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCredential(credential)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {canRevoke && credential.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeCredential(credential.credentialId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Hash: {truncateHash(credential.dataHash)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Issuer: {credential.issuer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Issued: {formatDate(credential.issuedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No credentials found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No credentials have been issued yet'
                }
              </p>
              {canIssue && !searchTerm && filterStatus === 'all' && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Issue First Credential
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Credential Details Modal */}
      <Dialog open={!!selectedCredential} onOpenChange={() => setSelectedCredential(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Credential Details</DialogTitle>
            <DialogDescription>
              Complete information about this blockchain credential
            </DialogDescription>
          </DialogHeader>

          {selectedCredential && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Credential ID</label>
                  <p className="mt-1 font-mono text-sm">{selectedCredential.credentialId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCredential.status)}`}>
                      {selectedCredential.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Student ID</label>
                <p className="mt-1">{selectedCredential.studentId}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Data Hash</label>
                <p className="mt-1 font-mono text-sm break-all">{selectedCredential.dataHash}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Issuing Organization</label>
                  <p className="mt-1">{selectedCredential.issuer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Date</label>
                  <p className="mt-1">{formatDate(selectedCredential.issuedAt)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Blockchain Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Stored on Hyperledger Fabric network</p>
                  <p>• Channel: mychannel</p>
                  <p>• Chaincode: cred</p>
                  <p>• Endorsement policy: Org1MSP AND Org2MSP</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}