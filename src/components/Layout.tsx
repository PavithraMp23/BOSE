import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import NotificationBell from '../modules/recruiter/components/NotificationBell';
import DarkModeToggle from './DarkModeToggle';
import { 
  Shield, 
  Menu, 
  X, 
  Home, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { SIDEBAR_LINKS } from '../lib/roles';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useStore();
  const location = useLocation();

  // Centralized role-based navigation using SIDEBAR_LINKS
  const role = (user?.role || '').toLowerCase();
  const rawLinks = user ? (SIDEBAR_LINKS as any)[role] || [] : [];
  const pickIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('home') || n.includes('dashboard')) return Home;
    if (n.includes('job') || n.includes('issue') || n.includes('credential')) return FileText;
    if (n.includes('applicant') || n.includes('profile') || n.includes('user') || n.includes('candidate')) return User;
    if (n.includes('verify') || n.includes('queue') || n.includes('share')) return Shield;
    if (n.includes('analytics') || n.includes('reports') || n.includes('log')) return BarChart3;
    if (n.includes('settings') || n.includes('bulk')) return Settings;
    return Home;
  };
  const navigation = rawLinks.map((l: any) => ({ ...l, icon: pickIcon(l.name) }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fade-in">
          <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800 shadow-2xl animate-slide-up">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <SidebarContent navigation={navigation} currentPath={location.pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent navigation={navigation} currentPath={location.pathname} />
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Global Search */}
            <form aria-label="Global search" role="search" className="flex flex-1 items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                aria-label="Search"
                placeholder="Search credentials, users, reports..."
                className="w-full max-w-xl rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Notifications */}
              <NotificationBell />

              {/* User menu */}
              <div className="flex items-center gap-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-white dark:ring-gray-700">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden lg:flex lg:flex-col lg:text-sm lg:leading-6">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</span>
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10 animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, currentPath }: { navigation: any[], currentPath: string }) {
  const { user } = useAuth();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg px-6 custom-scrollbar">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">BOSE</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Blockchain Credentials</p>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                        'group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-200',
                        'hover:scale-[1.02] active:scale-[0.98]'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive 
                            ? 'text-blue-700 dark:text-blue-400' 
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-700 dark:group-hover:text-blue-400',
                          'h-6 w-6 shrink-0 transition-colors duration-200'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto mb-6">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 p-4 border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">{user?.organization}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 capitalize">{user?.role} Access</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}