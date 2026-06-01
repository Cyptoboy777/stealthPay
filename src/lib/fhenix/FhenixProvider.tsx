'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';
import { toast } from 'sonner';

// Mocking FhenixClient to bypass Next.js 15 WebAssembly build errors
class MockFhenixClient {
  constructor(provider: any) {}
  
  async encrypt_uint256(value: number) {
    // Simulate encryption delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return { data: `0x${randomHex}` };
  }
}

interface FhenixContextType {
  client: MockFhenixClient | null;
  isInitialized: boolean;
}

const FhenixContext = createContext<FhenixContextType>({
  client: null,
  isInitialized: false,
});

export const FhenixProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: walletClient } = useWalletClient();
  const [client, setClient] = useState<MockFhenixClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initFhenix = async () => {
      if (!walletClient) return;
      try {
        // Initialize Mock Fhenix Client
        const mockClient = new MockFhenixClient(walletClient);
        setClient(mockClient);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Fhenix Client:', error);
      }
    };

    initFhenix();
  }, [walletClient]);

  return (
    <FhenixContext.Provider value={{ client, isInitialized }}>
      {children}
    </FhenixContext.Provider>
  );
};

export const useFhenix = () => useContext(FhenixContext);
