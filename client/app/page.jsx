'use client';

import '../styles/globals.css';

import React from 'react';
import Link from 'next/link';
import ChatContainer from './components/ChatContainer';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

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
              Adaptive Probe v1.0 &bull; AI-Powered Qualitative Research
            </p>
            <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">
              View Researcher Dashboard &rarr;
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-blue-300 text-sm font-medium">AI-Powered Qualitative Research</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Unlock Deeper Insights with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Adaptive Interviews
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Adaptive Probe uses AI to conduct intelligent, probe-based qualitative interviews. 
              It listens, evaluates response depth, and asks follow-up questions &mdash; just like a skilled researcher.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 text-center"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all text-center"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-400">No credit card required &bull; Start interviewing in minutes</p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80h1440V30C1200 60 960 0 720 30S240 60 0 30v50z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Researchers Choose Adaptive Probe
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Built for qualitative researchers who need rich, detailed interview data without the manual effort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptive Probing</h3>
              <p className="text-gray-500 leading-relaxed">
                AI evaluates response depth in real-time and issues up to 3 neutral follow-up probes to elicit richer, more detailed answers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Researcher Dashboard</h3>
              <p className="text-gray-500 leading-relaxed">
                Review full transcripts, AI-generated summaries, and export session data. Everything you need for analysis in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strict Neutrality</h3>
              <p className="text-gray-500 leading-relaxed">
                System prompt enforcement ensures unbiased, neutral probing. No leading questions &mdash; just authentic participant responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              From session start to AI summary in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Session</h3>
              <p className="text-gray-500 text-sm">Create an interview session and receive your first AI-generated question.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Participants Respond</h3>
              <p className="text-gray-500 text-sm">Participants answer naturally through a clean, conversational chat interface.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Probes Deeper</h3>
              <p className="text-gray-500 text-sm">The AI evaluates response depth and issues neutral follow-up probes when needed.</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">4</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review &amp; Export</h3>
              <p className="text-gray-500 text-sm">Get AI summaries, full transcripts, and export data for your research analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Research?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Join researchers using AI-powered adaptive probing to uncover deeper qualitative insights, faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all text-center"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 transition-all text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="text-white font-bold text-lg">Adaptive Probe</span>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Adaptive Probe. AI-Powered Qualitative Research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

