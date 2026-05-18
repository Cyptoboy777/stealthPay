import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';

export type Role = 'employer' | 'employee' | 'treasurer' | null;
export type PayrollState = 'idle' | 'uploaded' | 'approved' | 'claimed';

interface Web3State {
  isConnected: boolean;
  walletAddress: string | null;
  role: Role;
  balance: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  // Global Workflow states
  payrollState: PayrollState;
  employerSignature: string | null;
  treasurerSignature: string | null;
  employeeClaimHash: string | null;
}

interface Web3ContextType extends Web3State {
  connectWallet: (role: Role) => Promise<void>;
  disconnectWallet: () => void;
  // Global Workflow actions
  setPayrollState: (state: PayrollState) => void;
  setEmployerSignature: (sig: string | null) => void;
  setTreasurerSignature: (sig: string | null) => void;
  setEmployeeClaimHash: (hash: string | null) => void;
  resetWorkflow: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<Web3State, 'payrollState' | 'employerSignature' | 'treasurerSignature' | 'employeeClaimHash'>>({
    isConnected: false,
    walletAddress: null,
    role: null,
    balance: "0",
    provider: null,
    signer: null,
  });

  const [payrollState, setPayrollStateInternal] = useState<PayrollState>('idle');
  const [employerSignature, setEmployerSignatureInternal] = useState<string | null>(null);
  const [treasurerSignature, setTreasurerSignatureInternal] = useState<string | null>(null);
  const [employeeClaimHash, setEmployeeClaimHashInternal] = useState<string | null>(null);

  // Sync state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('stealthpay_payroll_state');
      if (savedState) setPayrollStateInternal(savedState as PayrollState);
      
      const savedEmpSig = localStorage.getItem('stealthpay_emp_sig');
      if (savedEmpSig) setEmployerSignatureInternal(savedEmpSig);

      const savedTreSig = localStorage.getItem('stealthpay_tre_sig');
      if (savedTreSig) setTreasurerSignatureInternal(savedTreSig);

      const savedClaimHash = localStorage.getItem('stealthpay_claim_hash');
      if (savedClaimHash) setEmployeeClaimHashInternal(savedClaimHash);

      const savedIsConnected = localStorage.getItem('stealthpay_connected') === 'true';
      const savedRole = localStorage.getItem('stealthpay_role') as Role;
      const savedAddress = localStorage.getItem('stealthpay_address');
      
      if (savedIsConnected && savedRole) {
        setState({
          isConnected: true,
          role: savedRole,
          walletAddress: savedAddress || '0x8A4B29E3C98a1C2E09b4566F81a2829b3e10A1B2',
          balance: localStorage.getItem('stealthpay_balance') || '7.5240',
          provider: null,
          signer: {
            signMessage: async (msg: string) => {
              console.log("Mock signing message:", msg);
              return '0x' + Array.from({length: 130}, () => Math.floor(Math.random()*16).toString(16)).join('');
            }
          } as any
        });
      }
    }
  }, []);

  const setPayrollState = (val: PayrollState) => {
    setPayrollStateInternal(val);
    localStorage.setItem('stealthpay_payroll_state', val);
  };

  const setEmployerSignature = (val: string | null) => {
    setEmployerSignatureInternal(val);
    if (val) localStorage.setItem('stealthpay_emp_sig', val);
    else localStorage.removeItem('stealthpay_emp_sig');
  };

  const setTreasurerSignature = (val: string | null) => {
    setTreasurerSignatureInternal(val);
    if (val) localStorage.setItem('stealthpay_tre_sig', val);
    else localStorage.removeItem('stealthpay_tre_sig');
  };

  const setEmployeeClaimHash = (val: string | null) => {
    setEmployeeClaimHashInternal(val);
    if (val) localStorage.setItem('stealthpay_claim_hash', val);
    else localStorage.removeItem('stealthpay_claim_hash');
  };

  const resetWorkflow = () => {
    setPayrollStateInternal('idle');
    setEmployerSignatureInternal(null);
    setTreasurerSignatureInternal(null);
    setEmployeeClaimHashInternal(null);
    localStorage.removeItem('stealthpay_payroll_state');
    localStorage.removeItem('stealthpay_emp_sig');
    localStorage.removeItem('stealthpay_tre_sig');
    localStorage.removeItem('stealthpay_claim_hash');
  };

  const connectWallet = async (role: Role) => {
    let address = '0x8A4B29E3C98a1C2E09b4566F81a2829b3e10A1B2';
    let balanceEth = "7.5240";
    let mockSigner: any = null;
    let mockProvider: any = null;

    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch (e) {
      inIframe = true;
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
    }

    if (hasEthereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        address = accounts[0];
        const balanceWei = await provider.getBalance(address);
        balanceEth = parseFloat(ethers.formatEther(balanceWei)).toFixed(4);
        mockSigner = signer;
        mockProvider = provider;

        window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            disconnectWallet();
          } else {
            setState((prev) => ({ ...prev, walletAddress: newAccounts[0] }));
            localStorage.setItem('stealthpay_address', newAccounts[0]);
          }
        });
        
        window.ethereum.on('chainChanged', () => {
          try {
            disconnectWallet();
          } catch (e) {
            console.error("Error handling chain change", e);
          }
        });
      } catch (error: any) {
        console.error("MetaMask connection failed. Using mock data.", error);
        address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
        balanceEth = (Math.random() * 10 + 1).toFixed(4);
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

    localStorage.setItem('stealthpay_connected', 'true');
    localStorage.setItem('stealthpay_role', role || '');
    localStorage.setItem('stealthpay_address', address);
    localStorage.setItem('stealthpay_balance', balanceEth);

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
    localStorage.removeItem('stealthpay_connected');
    localStorage.removeItem('stealthpay_role');
    localStorage.removeItem('stealthpay_address');
    localStorage.removeItem('stealthpay_balance');

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
    <Web3Context.Provider value={{
      ...state,
      payrollState,
      employerSignature,
      treasurerSignature,
      employeeClaimHash,
      connectWallet,
      disconnectWallet,
      setPayrollState,
      setEmployerSignature,
      setTreasurerSignature,
      setEmployeeClaimHash,
      resetWorkflow
    }}>
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

declare global {
  interface Window {
    ethereum?: any;
  }
}
