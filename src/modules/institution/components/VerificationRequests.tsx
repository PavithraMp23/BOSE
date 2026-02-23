import { Eye, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { useVerificationRequests } from '../hooks/useVerificationRequests';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Card } from '../../../components/ui/card';
import { formatDistance } from 'date-fns';

export default function VerificationRequests() {
  const { requests, loading, approveRequest, rejectRequest } = useVerificationRequests();

  if (loading) return <div>Loading verification requests...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
      
      {requests.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
          <p>No pending verification requests</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map(request => (
            <Card key={request._id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {request.credential?.title || 'Untitled Credential'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.credential?.studentName} • {request.credential?.type}
                  </p>
                  <p className="text-xs text-gray-400">
                    Requested {formatDistance(new Date(request.createdAt), new Date(), { addSuffix: true })}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Credential Details</DialogTitle>
                        <DialogDescription>
                          Review the uploaded credential
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Title</label>
                            <p>{request.credential?.title}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Type</label>
                            <p>{request.credential?.type}</p>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">Student</label>
                          <p>{request.credential?.studentName}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">Institution</label>
                          <p>{request.credential?.institution}</p>
                        </div>

                        {request.credential?.attachments?.[0]?.url && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Document</label>
                            <div className="mt-2">
                              <a
                                href={request.credential.attachments[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600"
                              >
                                View Document
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            onClick={() => rejectRequest(request._id)}
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => approveRequest(request._id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => rejectRequest(request._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-500 hover:text-green-600"
                    onClick={() => approveRequest(request._id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}