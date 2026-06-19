'use client';

import { Toaster } from 'sonner';

export function ToastProvider({ children }) {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={5000}
      />
      {children}
    </>
  );
}
