'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useWeb3, Role } from '@/src/lib/Web3Context';
import { Shield, Wallet, LogOut, Code, Activity, Hexagon, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isConnected, walletAddress, role, disconnectWallet, connectWallet, resetWorkflow } = useWeb3();
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

  const handleLogout = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleSelectRole = async (selectedRole: Role) => {
    setIsDropdownOpen(false);
    await connectWallet(selectedRole);
    router.push(`/${selectedRole}`);
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
        {/* Animated top line indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Hexagon className="absolute inset-0 w-full h-full text-cyan-500/30 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-[spin_4s_linear_infinite]" />
              <Shield className="h-4 w-4 relative z-10 text-cyan-50 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-widest text-cyan-100 font-mono uppercase group-hover:text-cyan-300 transition-colors">
              Stealth<span className="text-cyan-500">PAY</span>
            </span>
          </Link>
          
          <nav className="flex items-center space-x-4" ref={dropdownRef}>
            {isConnected ? (
              <>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  <span className="text-cyan-400 flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    Fhenix Testnet
                  </span>
                </div>

                {/* Simulated role badges / Switcher */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex gap-2.5 items-center bg-black/40 border border-cyan-500/20 rounded-lg p-1.5 hover:bg-cyan-500/10 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] transition-all duration-200 cursor-pointer"
                  >
                    <span className="hidden sm:inline-block text-xs text-cyan-300/80 font-mono pl-2 pr-2 border-r border-cyan-500/20">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </span>
                    
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border shadow-[0_0_10px_rgba(6,182,212,0.1)] flex items-center gap-1.5 ${
                      role === 'employer' ? 'text-purple-400 border-purple-500/40 bg-purple-500/10' :
                      role === 'employee' ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' :
                      'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                    }`}>
                      {role}_NODE
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

                <Button variant="ghost" onClick={handleLogout} title="DISCONNECT" className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase border border-cyan-500/30 text-cyan-500 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer px-3 h-8 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="relative">
                <Button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-mono text-[10px] tracking-widest uppercase rounded-lg px-4 h-10 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 cursor-pointer"
                >
                  <Wallet className="h-4 w-4 text-cyan-400 animate-pulse" />
                  Secure Web3 Wallet Connect
                  <ChevronDown className="h-3 w-3 text-cyan-500" />
                </Button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-cyan-500/30 bg-black/90 p-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(6,182,212,0.2)] z-50 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-cyan-500/10 mb-1">
                      <p className="text-[9px] font-mono tracking-wider text-cyan-500/50 uppercase">Select Secure Node</p>
                    </div>
                    <button 
                      onClick={() => handleSelectRole('employer')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-500/10 text-left font-mono text-[11px] text-purple-300 border border-transparent hover:border-purple-500/30 transition-all duration-200 cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      EMPLOYER_NODE
                    </button>
                    <button 
                      onClick={() => handleSelectRole('employee')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cyan-500/10 text-left font-mono text-[11px] text-cyan-300 border border-transparent hover:border-cyan-500/30 transition-all duration-200 cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                      EMPLOYEE_NODE
                    </button>
                    <button 
                      onClick={() => handleSelectRole('treasurer')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-500/10 text-left font-mono text-[11px] text-emerald-300 border border-transparent hover:border-emerald-500/30 transition-all duration-200 cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      TREASURER_NODE
                    </button>
                  </div>
                )}
              </div>
            )}
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
