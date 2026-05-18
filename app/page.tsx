'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3, Role } from '@/src/lib/Web3Context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/Card';
import { ShieldCheck, Cpu, Terminal, Users, Lock, Vault, Activity } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import HeroScene from '@/src/components/HeroScene';
import WalkthroughSection from '@/src/components/WalkthroughSection';

export default function Home() {
  const { connectWallet, isConnected, role } = useWeb3();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLaunching, setIsLaunching] = React.useState(false);
  const [introPlaying, setIntroPlaying] = React.useState(true);
  
  React.useEffect(() => {
    // End intro sequence after 3.5 seconds
    const timer = setTimeout(() => {
      setIntroPlaying(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBackground = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  React.useEffect(() => {
    if (isConnected && role) {
      router.push(`/${role}`);
    }
  }, [isConnected, role, router]);

  const handleConnect = (selectedRole: Role) => {
    connectWallet(selectedRole);
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    // Redirect to the 3D Walkthrough flow
    setTimeout(() => {
      router.push('/walkthrough');
    }, 2500);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center space-y-24 py-24 w-full max-w-[100vw] overflow-hidden -mt-16 pt-32">
      <motion.div style={{ y: yBackground, opacity: opacityBackground }} className="fixed inset-0 -z-10 bg-[#02050A]">
        <HeroScene zooming={isLaunching} introPlaying={introPlaying} />
      </motion.div>

      <motion.div 
        animate={{ opacity: isLaunching || introPlaying ? 0 : 1, y: isLaunching ? -50 : introPlaying ? 50 : 0, filter: isLaunching || introPlaying ? 'blur(10px)' : 'blur(0px)' }}
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-5xl text-center space-y-8 relative z-10 px-4 ${isLaunching || introPlaying ? 'pointer-events-none' : ''}`}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#050A15]/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] mb-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] relative overflow-hidden backdrop-blur-xl cursor-default"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]"></span>
          <span className="font-bold">SYSTEM_ONLINE // STEALTHPAY CoFHE</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-purple-500 drop-shadow-[0_0_40px_rgba(168,85,247,0.5)] leading-tight pb-6">
          CONFIDENTIAL
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">PAYROLL_PROTOCOL</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-cyan-50/70 max-w-4xl mx-auto font-light leading-relaxed tracking-wide mix-blend-screen">
          Fully Homomorphic Encryption for DAOs & Enterprises. Process on-chain salary streams without exposing transaction amounts. Powered by <span className="font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">Fhenix</span> & <span className="font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Privara</span>.
        </p>

        <motion.div
           whileHover={{ scale: 1.05 }}
           className="mt-8 pt-4 pb-2 flex justify-center"
        >
            <button 
                onClick={handleLaunch}
                className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-12 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] cursor-pointer uppercase tracking-[0.3em] font-mono"
            >
                 <div className="absolute inset-0 bg-white/20 group-hover:animate-shine mix-blend-overlay"></div>
                 <span className="relative z-10 flex items-center gap-4 text-lg">
                     <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                     {isLaunching ? 'ESTABLISHING_SECURE_LINK...' : 'LAUNCH APP'}
                 </span>
            </button>
        </motion.div>

        {/* Ecosystem Architecture - Interactive Login Portals */}
        <div className="pt-16 w-full max-w-6xl mx-auto space-y-8 text-left relative z-20" style={{ pointerEvents: 'auto' }}>
           <div className="text-center mb-8">
              <h2 className="font-mono text-xl md:text-2xl font-black text-white tracking-widest uppercase">Select Node & Connect Web3 Wallet</h2>
              <p className="text-cyan-500/60 font-mono text-xs tracking-widest mt-2">StealthPay Network Architecture</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
              <Card 
                onClick={() => handleConnect('employer')}
                className="group relative bg-[#060410]/80 backdrop-blur-2xl border border-purple-500/30 hover:border-purple-400/80 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(168,85,247,0.3)] transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer pointer-events-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors duration-500"></div>
                
                <CardHeader className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-[#0a0514] border border-purple-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]">
                    <Users className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-purple-50 font-black font-mono tracking-tighter">ROOT_EMPLOYER</CardTitle>
                  <CardDescription className="text-purple-200/50 leading-relaxed mt-2 font-mono text-[10px]">Init encrypted batch payloads & manage stealth roster without exposing burn rate.</CardDescription>
                </CardHeader>
              </Card>

              <Card 
                onClick={() => handleConnect('employee')}
                className="group relative bg-[#020813]/80 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400/80 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(6,182,212,0.3)] transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer pointer-events-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors duration-500"></div>

                <CardHeader className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-[#030d1a] border border-cyan-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
                    <Lock className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-cyan-50 font-black font-mono tracking-tighter">USER_WALLET</CardTitle>
                  <CardDescription className="text-cyan-200/50 leading-relaxed mt-2 font-mono text-[10px]">Decrypt incoming streams. Zero-knowledge access to your personal payout vault.</CardDescription>
                </CardHeader>
              </Card>

              <Card 
                onClick={() => handleConnect('treasurer')}
                className="group relative bg-[#020a06]/80 backdrop-blur-2xl border border-emerald-500/30 hover:border-emerald-400/80 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.3)] transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer pointer-events-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors duration-500"></div>

                <CardHeader className="relative z-10 p-6">
                  <div className="h-12 w-12 rounded-xl bg-[#04120a] border border-emerald-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]">
                    <Vault className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-emerald-50 font-black font-mono tracking-tighter">MULTI_SIG_OPS</CardTitle>
                  <CardDescription className="text-emerald-200/50 leading-relaxed mt-2 font-mono text-[10px]">Approve FHE computes & encrypted state changes. Prove solvency without exposure.</CardDescription>
                </CardHeader>
              </Card>
           </div>
           
           <div className="w-full max-w-7xl mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#05070A]/80 backdrop-blur-2xl text-white p-8 md:p-12 rounded-[2rem] border border-cyan-500/20 shadow-[0_30px_100px_rgba(6,182,212,0.1)] relative overflow-hidden mx-auto">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)] font-mono">
                  ZK_COMPLIANCE_ACTIVE
                </span>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                  Privacy-by-Design <br/> From Genesis Block
                </h3>
                <p className="text-cyan-100/60 leading-relaxed font-light text-sm max-w-xl">
                  No more strategy leaks or MEV extraction from your treasury operations. Utilize Fhenix CoFHE for full
                  homomorphic encryption computations. Salaries are processed securely and only intended recipients can decrypt them.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                     <ShieldCheck className="w-4 h-4 text-emerald-400" /> ZK_PROOFS
                  </div>
                  <div className="flex items-center gap-2 text-xs text-purple-300 font-mono bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                     <Cpu className="w-4 h-4 text-purple-400" /> FHE_COPROCESSOR
                  </div>
                </div>
              </div>

              <div className="bg-[#02050A] p-6 rounded-2xl font-mono text-xs leading-relaxed border border-cyan-500/30 shadow-[inset_0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden h-full flex flex-col justify-center text-left">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.03)_2px,rgba(6,182,212,0.03)_4px)] pointer-events-none"></div>
                
                <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/20 pb-3">
                  <Terminal className="w-4 h-4 text-cyan-500/60" />
                  <span className="text-cyan-500/60 uppercase tracking-widest text-[10px]">Fhenix_Smart_Contract.sol</span>
                </div>

                <p className="text-slate-500/80 mb-2">{`// Secure Payroll FHE Execution`}</p>
                <p className="text-cyan-300 mb-1"><span className="text-purple-400">euint256</span> employeeSalary = FHE.asEuint256(encryptedInput);</p>
                <p className="text-cyan-300 mb-1"><span className="text-purple-400">euint256</span> taxAmount = employeeSalary.mul(taxRate);</p>
                <p className="text-cyan-300 mb-3"><span className="text-purple-400">euint256</span> netPayout = employeeSalary.sub(taxAmount);</p>
                <p className="text-emerald-500/60 mt-3">{`// State transitions resolved strictly in ciphertext`}</p>
                <p className="text-emerald-500/60">{`// Compliance verifications via zk-SNARKs`}</p>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Black overlay fade for cinematic transition */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="fixed inset-0 z-50 bg-[#01030a] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
}
