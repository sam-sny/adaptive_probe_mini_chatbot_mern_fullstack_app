import React from 'react';
import '../styles/globals.css';
import { ToastProvider } from './components/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';

export const metadata = {
  title: 'Adaptive Probe - AI Market Research',
  description: 'Intelligent qualitative research chatbot using adaptive probing',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
