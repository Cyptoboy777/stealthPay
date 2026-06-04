'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { usePayrollStore, Role } from '@/src/store/usePayrollStore';
import { Shield, Hexagon, ChevronDown, RefreshCw } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isConnected, address: walletAddress } = useAccount();
  const { disconnect } = useDisconnect();
  
  const { activeRole: role, setActiveRole, resetWorkflow } = usePayrollStore();
  
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (selectedRole: Role) => {
    setIsDropdownOpen(false);
    setActiveRole(selectedRole);
    if (selectedRole) {
      router.push(`/${selectedRole}`);
    }
  };

  const handleResetWorkflow = () => {
    resetWorkflow();
    alert("System-wide payroll workflow state reset to Genesis (IDLE)!");
    setIsDropdownOpen(false);
  };

  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#02050A] font-sans text-cyan-50 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
      <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-[#02050A]/70 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <div className="container mx-auto flex h-28 items-center justify-between px-4 sm:px-8">
          <Link href="/walkthrough" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="StealthPay Logo" className="h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          </Link>
          
          <nav className="flex items-center space-x-4" ref={dropdownRef}>
            {isConnected && (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex gap-2.5 items-center bg-black/40 border border-cyan-500/20 rounded-lg p-1.5 hover:bg-cyan-500/10 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] transition-all duration-200 cursor-pointer"
                >
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border shadow-[0_0_10px_rgba(6,182,212,0.1)] flex items-center gap-1.5 ${
                    role === 'employer' ? 'text-purple-400 border-purple-500/40 bg-purple-500/10' :
                    role === 'employee' ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' :
                    role === 'treasurer' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
                    'text-slate-400 border-slate-500/40 bg-slate-500/10'
                  }`}>
                    {role ? `${role}_NODE` : 'SELECT_NODE'}
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-cyan-500/30 bg-black/90 p-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(6,182,212,0.2)] z-50 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-cyan-500/10 mb-1 flex justify-between items-center">
                      <p className="text-[9px] font-mono tracking-wider text-cyan-500/50 uppercase">Switch Node</p>
                      <button 
                        onClick={handleResetWorkflow}
                        title="Reset Workflow State"
                        className="text-cyan-500/40 hover:text-cyan-300 transition-colors p-1 hover:bg-cyan-500/10 rounded cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSelectRole('employer')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-mono text-[11px] border transition-all duration-200 cursor-pointer ${
                        role === 'employer' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)] font-bold' 
                          : 'hover:bg-purple-500/10 text-purple-400 border-transparent hover:border-purple-500/30'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      EMPLOYER_NODE
                    </button>
                    <button 
                      onClick={() => handleSelectRole('employee')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-mono text-[11px] border transition-all duration-200 cursor-pointer ${
                        role === 'employee' 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-bold' 
                          : 'hover:bg-cyan-500/10 text-cyan-400 border-transparent hover:border-cyan-500/30'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                      EMPLOYEE_NODE
                    </button>
                    <button 
                      onClick={() => handleSelectRole('treasurer')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left font-mono text-[11px] border transition-all duration-200 cursor-pointer ${
                        role === 'treasurer' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-bold' 
                          : 'hover:bg-emerald-500/10 text-emerald-400 border-transparent hover:border-emerald-500/30'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      TREASURER_NODE
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <ConnectButton showBalance={false} chainStatus="icon" />
          </nav>
        </div>
      </header>
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d41a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d41a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <main className={`container mx-auto flex-1 ${isHome ? 'px-0' : 'px-4 sm:px-8 py-8'} relative z-10`}>
        {children}
      </main>
    </div>
  );
}
