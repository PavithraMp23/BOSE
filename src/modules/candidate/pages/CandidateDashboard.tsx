import { useState } from 'react';
import { useCandidateSummary } from "../hooks/useCandidateSummary";
import DashboardCard from "../components/DashboardCard";
import CredentialUpload from "../components/CredentialUpload";
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
  Upload, 
  Briefcase, 
  Award, 
  TrendingUp,
  FileText,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useMyCredentials } from '../hooks/useMyCredentials';
import { Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const { loading } = useCandidateSummary();
  const { apps } = useApplications();
  const { data: credentials } = useMyCredentials();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'credentials'>('overview');

  // Calculate stats
  const verifiedCount = credentials?.filter((c: any) => c.status === 'verified').length || 0;
  const pendingCount = credentials?.filter((c: any) => c.status === 'pending').length || 0;
  const activeApplications = apps?.filter((app: any) => 
    ['applied', 'under_review', 'interview'].includes(app.status?.toLowerCase())
  ).length || 0;

  // Recent activity
  const recentApplications = apps?.slice(0, 3) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Candidate Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your credentials, applications, and career growth
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="gradient" onClick={() => setActiveTab('credentials')}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Credential
          </Button>
          <Link to="/dashboard/recruiter/jobs">
            <Button variant="outline">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          label="Verified Credentials" 
          value={verifiedCount} 
          color="green"
          icon={<Award className="h-6 w-6 text-green-600 dark:text-green-400" />}
        />
        <DashboardCard 
          label="Pending Verification" 
          value={pendingCount} 
          color="yellow"
          icon={<Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
        />
        <DashboardCard 
          label="Active Applications" 
          value={activeApplications} 
          color="blue"
          icon={<Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <DashboardCard 
          label="Profile Completeness" 
          value={`${Math.min(100, (verifiedCount * 20 + activeApplications * 10))}%`} 
          color="purple"
          trend={5}
          icon={<TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'applications', label: 'Applications', icon: Briefcase },
            { id: 'credentials', label: 'Credentials', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((app: any) => (
                    <div key={app.id || app._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{app.jobTitle || 'Job Application'}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.companyName || 'Company'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'applied' || app.status === 'Applied' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : app.status === 'under_review' || app.status === 'Under Review'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : app.status === 'accepted' || app.status === 'Accepted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {app.status || 'Applied'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('applications')}>
                    View All Applications
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No applications yet</p>
                  <Link to="/dashboard/recruiter/jobs">
                    <Button variant="outline">Browse Jobs</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('credentials')}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Credential
              </Button>
              <Link to="/dashboard/recruiter/jobs" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/dashboard/student" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Portfolio
                </Button>
              </Link>
              <Link to="/dashboard/student?tab=recommendations" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Recommendations
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {apps && apps.length > 0 ? (
                <div className="space-y-4">
                  {apps.map((app: any) => (
                    <div key={app.id || app._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{app.jobTitle || 'Job Position'}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{app.companyName || 'Company'}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'applied' || app.status === 'Applied' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : app.status === 'under_review' || app.status === 'Under Review'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : app.status === 'accepted' || app.status === 'Accepted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : app.status === 'rejected' || app.status === 'Rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {app.status || 'Applied'}
                          </span>
                          <Button variant="ghost" size="sm">Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No applications yet</p>
                  <Link to="/dashboard/recruiter/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <CredentialUpload onUploaded={() => { window.location.reload(); }} />
          
          <Card>
            <CardHeader>
              <CardTitle>My Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              {credentials && credentials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {credentials.map((cred: any) => (
                    <div key={cred.id || cred._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{cred.title || 'Credential'}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cred.type || 'Certificate'}</p>
                        </div>
                        {cred.status === 'verified' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : cred.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cred.status === 'verified'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : cred.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {cred.status || 'Pending'}
                        </span>
                        {cred.issuedOn && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(cred.issuedOn).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No credentials uploaded yet</p>
                  <Button onClick={() => setActiveTab('credentials')}>Upload Your First Credential</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


