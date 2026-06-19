'use client';

import '../../styles/globals.css';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ChatWindow from './ChatWindow';
import InputArea from './InputArea';
import { chatAPI } from '../../lib/api';

export const ChatContainer = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const newSession = await chatAPI.createNewSession();
        setSession(newSession);
        setError(null);
      } catch (err) {
        const errorMsg = err.message;
        setError(errorMsg);
        toast.error(errorMsg);
        console.error('Failed to initialize session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const handleSubmitAnswer = async (userMessage) => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatedSession = await chatAPI.submitAnswer(session._id, userMessage);
      setSession(updatedSession);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      console.error('Failed to submit answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing session...</p>
            </>
          ) : error ? (
            <>
              <p className="text-red-600 font-semibold mb-2">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Adaptive Probe Interview</h1>
        <p className="text-sm text-gray-600 mt-1">
          {session.isCompleted ? '✅ Interview Complete' : '🔴 Interview In Progress'}
        </p>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col p-6">
        <ChatWindow messages={session.messages} isLoading={isLoading} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        <InputArea
          onSubmit={handleSubmitAnswer}
          isDisabled={session.isCompleted}
          isLoading={isLoading}
        />
        {session.isCompleted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800 mb-2">📊 Interview Summary:</p>
            <p className="text-sm text-green-700">{session.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
