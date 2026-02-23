import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateHash(hash: string, length = 8) {
  return `${hash.substring(0, length)}...${hash.substring(hash.length - 4)}`;
}

export function getStatusColor(status: string) {
  const colors = {
    active: 'bg-green-100 text-green-800',
    revoked: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getRoleColor(role: string) {
  const colors = {
    student: 'bg-blue-100 text-blue-800',
    university: 'bg-green-100 text-green-800',
    recruiter: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800'
  };
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}