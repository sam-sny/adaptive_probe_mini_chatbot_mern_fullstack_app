'use client';

import '../../../styles/globals.css';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { chatAPI } from '../../../lib/api';
import { ProtectedRoute } from '../../components/ProtectedRoute';

function SessionDetailContent() {
  const params = useParams();
  const sessionId = params.id;

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const sessionData = await chatAPI.getSessionTranscript(sessionId);
        setSession(sessionData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <p className="text-gray-600">Session not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{session.studyContext}</h1>
                <p className="text-sm text-gray-600">
                  Session ID: <code className="bg-gray-100 px-2 py-1 rounded">{session._id}</code>
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  session.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {session.isCompleted ? '✅ Complete' : '🔴 In Progress'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Probes Asked</p>
                <p className="text-xl font-semibold text-gray-900">{session.probeCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Messages</p>
                <p className="text-xl font-semibold text-gray-900">{session.messages?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Created</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {session.summary && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">📊 AI-Generated Summary</h2>
            <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {session.summary}
            </div>
          </div>
        )}

        {/* Full Transcript */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">💬 Full Transcript</h2>

          <div className="space-y-4">
            {session.messages
              .filter((msg) => msg.role !== 'system')
              .map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-2xl p-4 rounded-lg ${
                        isUser
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {isUser ? '👤 User' : '🤖 Assistant'} •{' '}
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SessionDetail() {
  return (
    <ProtectedRoute>
      <SessionDetailContent />
    </ProtectedRoute>
  );
}
