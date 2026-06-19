'use client';

import '../../styles/globals.css';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { chatAPI } from '../../lib/api';

export const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const allSessions = await chatAPI.getAllSessions();
        setSessions(allSessions);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No interview sessions yet.</p>
        <Link href="/" className="btn-primary">
          Start New Interview
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <Link key={session._id} href={`/dashboard/${session._id}`}>
          <div className="session-card">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{session.studyContext}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  session.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {session.isCompleted ? 'Complete' : 'In Progress'}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <p>📊 Probes: {session.probeCount}</p>
              <p>💬 Messages: {session.messages?.length || 0}</p>
            </div>

            {session.summary && (
              <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Summary:</strong> {session.summary.substring(0, 100)}...
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              {new Date(session.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SessionsList;
