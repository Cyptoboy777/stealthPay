'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useWeb3 } from '@/src/lib/Web3Context';
import { Shield, Wallet, LogOut, Code, Activity, Hexagon } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isConnected, walletAddress, role, disconnectWallet } = useWeb3();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    disconnectWallet();
    router.push('/');
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
          
          <nav className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  <span className="text-cyan-400 flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    Fhenix Testnet
                  </span>
                </div>

                {/* Simulated role badges */}
                <div className="flex gap-2.5 items-center bg-black/40 border border-cyan-500/20 rounded-lg p-1.5 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                  <span className="hidden sm:inline-block text-xs text-cyan-300/80 font-mono pl-3 pr-2 border-r border-cyan-500/20">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </span>
                  
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border shadow-[0_0_10px_rgba(6,182,212,0.1)] ${
                    role === 'employer' ? 'text-purple-400 border-purple-500/40 bg-purple-500/10' :
                    role === 'employee' ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' :
                    'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                  }`}>
                    {role}_NODE
                  </span>
                </div>

                <Button variant="ghost" size="icon" onClick={handleLogout} title="DISCONNECT" className="text-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-[10px] font-mono tracking-widest text-cyan-500/50 flex items-center gap-2 uppercase">
                  <Code className="h-4 w-4 text-cyan-500/40"/> Connect to Fhenix
                </div>
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
