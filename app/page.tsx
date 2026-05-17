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
        
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-purple-500 drop-shadow-[0_0_40px_rgba(168,85,247,0.5)] leading-none pb-2">
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

        {/* Floating Encrypted Dashboard Panels Simulation */}
        <div className="pt-8 flex flex-wrap justify-center gap-6 text-left perspective-1000">
           <motion.div 
             animate={{ y: [0, -15, 0], rotateX: [5, 10, 5], rotateY: [-5, 0, -5] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="bg-purple-950/40 backdrop-blur-2xl border border-purple-500/50 p-5 rounded-2xl shadow-[0_20px_50px_rgba(168,85,247,0.2),inset_0_0_20px_rgba(168,85,247,0.1)] w-72 relative overflow-hidden transform-gpu"
           >
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
             <p className="text-purple-300 text-xs font-mono mb-2 flex items-center gap-2 tracking-widest"><Lock className="w-4 h-4"/> ENCRYPTED_STATE</p>
             <p className="text-purple-50 font-mono text-2xl overflow-hidden whitespace-nowrap border-r-[3px] border-purple-400 animate-[typing_2s_steps(20,end)_infinite]">
               0x8A4B29E3...
             </p>
           </motion.div>
           
           <motion.div 
             animate={{ y: [0, 15, 0], rotateX: [-5, 0, -5], rotateY: [5, 10, 5] }}
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
             className="bg-cyan-950/40 backdrop-blur-2xl border border-cyan-500/50 p-5 rounded-2xl shadow-[0_20px_50px_rgba(6,182,212,0.2),inset_0_0_20px_rgba(6,182,212,0.1)] w-72 relative overflow-hidden hidden md:block transform-gpu"
           >
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
             <p className="text-cyan-300 text-xs font-mono mb-2 flex items-center gap-2 tracking-widest"><Cpu className="w-4 h-4"/> FHE_BATCH_PAYLOAD</p>
             <p className="text-cyan-50 font-mono text-2xl blur-[2px] hover:blur-none transition-all duration-300 select-none tracking-widest">
               eU$*******
             </p>
           </motion.div>
           
           <motion.div 
             animate={{ y: [0, -10, 0], rotateZ: [-2, 2, -2] }}
             transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
             className="bg-emerald-950/40 backdrop-blur-2xl border border-emerald-500/50 p-5 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.2),inset_0_0_20px_rgba(16,185,129,0.1)] w-72 relative overflow-hidden hidden lg:block transform-gpu"
           >
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
             <p className="text-emerald-300 text-xs font-mono mb-2 flex items-center gap-2 tracking-widest"><Activity className="w-4 h-4"/> PRIVACY_BUDGET</p>
             <div className="h-8 flex items-center gap-1.5 mt-2">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="h-full w-2 bg-emerald-400 animate-[pulse_1.5s_infinite]" style={{ animationDelay: `${i * 0.1}s`, opacity: 0.8 }}></div>
               ))}
             </div>
           </motion.div>
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
