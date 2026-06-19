'use client';

import '../../styles/globals.css';

import React from 'react';
import Link from 'next/link';
import SessionsList from '../components/SessionsList';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Researcher Dashboard</h1>
                <p className="text-gray-600 mt-1">Review and analyze completed interviews</p>
              </div>
              <Link href="/" className="btn-primary">
                + New Interview
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Sessions</h2>
            <p className="text-sm text-gray-600">
              Click any session to view the full transcript and AI-generated insights.
            </p>
          </div>

          <SessionsList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
