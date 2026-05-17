import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';

export type Role = 'employer' | 'employee' | 'treasurer' | null;

interface Web3State {
  isConnected: boolean;
  walletAddress: string | null;
  role: Role;
  balance: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

interface Web3ContextType extends Web3State {
  connectWallet: (role: Role) => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    walletAddress: null,
    role: null,
    balance: "0",
    provider: null,
    signer: null,
  });

  const connectWallet = async (role: Role) => {
    let address = '0x0000000000000000000000000000000000000000';
    let balanceEth = "0.0";
    let mockSigner: any = null;
    let mockProvider: any = null;

    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch (e) {
      inIframe = true; // Error means we are definitely in a cross-origin iframe
    }

    let hasEthereum = false;
    if (!inIframe) {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          hasEthereum = true;
        }
      } catch (e) {
        console.warn("Could not check window.ethereum. Using mock data.", e);
      }
    } else {
      console.warn("Running inside iframe (AI Studio preview) — disabling MetaMask to prevent cross-origin errors. Using mock data.");
    }

    if (hasEthereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        address = accounts[0];
        const balanceWei = await provider.getBalance(address);
        balanceEth = ethers.formatEther(balanceWei);
        mockSigner = signer;
        mockProvider = provider;

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            disconnectWallet();
          } else {
            setState((prev) => ({ ...prev, walletAddress: newAccounts[0] }));
          }
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          try {
            disconnectWallet();
          } catch (e) {
            console.error("Error handling chain change", e);
          }
        });
      } catch (error: any) {
        console.error("MetaMask connection failed. Using mock data.", error);
        // Fallback to mock data for iframe environments (AI Studio)
        address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
        balanceEth = (Math.random() * 10 + 1).toFixed(4);
        
        // Setup mock signer for UI functionality
        mockSigner = {
          signMessage: async (msg: string) => {
            console.log("Mock signing message:", msg);
            return '0x' + Array.from({length: 130}, () => Math.floor(Math.random()*16).toString(16)).join('');
          }
        };
      }
    } else {
      console.warn("No Web3 provider found. Using mock data.");
      address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      balanceEth = (Math.random() * 10 + 1).toFixed(4);
      mockSigner = {
        signMessage: async (msg: string) => {
          console.log("Mock signing message:", msg);
          return '0x' + Array.from({length: 130}, () => Math.floor(Math.random()*16).toString(16)).join('');
        }
      };
    }

    setState({
      isConnected: true,
      walletAddress: address,
      role,
      balance: balanceEth,
      provider: mockProvider,
      signer: mockSigner,
    });
  };

  const disconnectWallet = () => {
    setState({
      isConnected: false,
      walletAddress: null,
      role: null,
      balance: "0",
      provider: null,
      signer: null,
    });
  };

  return (
    <Web3Context.Provider value={{ ...state, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Add ethereum interface to window
declare global {
  interface Window {
    ethereum?: any;
  }
}
