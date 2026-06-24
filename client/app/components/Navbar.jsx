'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    router.push('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Navbar */}
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/logo-icon.svg"
              alt="Adaptive Probe"
              className="h-10 w-10"
            />

            <h1 className="text-xl font-bold text-gray-900">
              Adaptive Probe
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-5">

                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="ml-3 px-4 py-2 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">

            {isAuthenticated ? (
              <>
                {/* User */}
                <div className="flex items-center gap-3">

                  <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>

                    <p className="text-xs text-gray-500 truncate max-w-[220px]">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}