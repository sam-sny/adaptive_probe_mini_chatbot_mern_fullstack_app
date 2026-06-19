'use client';

import '../styles/globals.css';

import React, { useState } from 'react';
import Link from 'next/link';
import ChatContainer from './components/ChatContainer';
import { useAuth } from './context/AuthContext';
import { toast } from 'sonner';

export default function Home() {
  const { isAuthenticated, loading, login, register } = useAuth();
  console.log('[Home] render — loading:', loading, '| isAuthenticated:', isAuthenticated);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col h-screen">
        <ChatContainer />
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Adaptive Probe v1.0 • AI-Powered Qualitative Research
            </p>
            <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">
              View Researcher Dashboard →
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Adaptive Probe</h1>
          <p className="text-gray-600">
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={isSignup ? 6 : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSignup && <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>}
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isSignup ? 'Creating Account...' : 'Signing in...'
              : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {!isSignup && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
        )}

        {!isSignup && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">Demo Account:</p>
            <p className="text-xs text-gray-700 mb-1"><strong>Email:</strong> demo@example.com</p>
            <p className="text-xs text-gray-700"><strong>Password:</strong> password123</p>
            <button
              type="button"
              onClick={() => { setEmail('demo@example.com'); setPassword('password123'); }}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              Use Demo Account →
            </button>
          </div>
        )}

        <p className="text-center text-gray-600">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => { setIsSignup(!isSignup); setPassword(''); setConfirmPassword(''); }}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
