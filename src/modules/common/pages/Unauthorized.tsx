import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">Unauthorized</h1>
                <p className="text-gray-600">You don't have permission to access this page.</p>
                <Link to="/dashboard" className="text-blue-600 hover:underline">Go to dashboard</Link>
            </div>
        </div>
    );
}
