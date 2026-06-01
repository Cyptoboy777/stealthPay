'use client';

import React from 'react';
import { Web3Provider } from '@/src/lib/web3/Web3Provider';
import { FhenixProvider } from '@/src/lib/fhenix/FhenixProvider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <FhenixProvider>
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0A0A0A',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FAFAFA',
              boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.2)',
            },
            className: 'backdrop-blur-xl',
          }}
        />
        {children}
      </FhenixProvider>
    </Web3Provider>
  );
}
