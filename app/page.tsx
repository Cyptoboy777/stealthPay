'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { usePayrollStore, Role } from '@/src/store/usePayrollStore';
import { Card, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Users, Lock, Vault, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroScene from '@/src/components/HeroScene';

export default function Home() {
  const { isConnected } = useAccount();
  const { activeRole: role, setActiveRole } = usePayrollStore();
  const router = useRouter();
  const [isLaunching, setIsLaunching] = React.useState(false);

  React.useEffect(() => {
    if (isConnected && role) {
      router.push(`/${role}`);
    }
  }, [isConnected, role, router]);

  const handleConnect = (selectedRole: Role) => {
    setActiveRole(selectedRole);
    router.push(`/${selectedRole}`);
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      router.push('/walkthrough');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#000000] text-[#FAFAFA] font-sans selection:bg-white/20">
      <div className="fixed inset-0 z-0">
        <HeroScene zooming={isLaunching} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLaunching ? 0 : 1, y: isLaunching ? -20 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mt-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
            Enterprise Privacy Protocol
          </div>
          
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.03em] md:text-7xl lg:text-[84px] leading-[1.1]">
            Confidential Payroll.
            <br />
            <span className="text-zinc-500">Perfectly Encrypted.</span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg text-zinc-400 font-light leading-relaxed">
            Process on-chain salary streams and treasury operations without exposing sensitive data. Powered by Fully Homomorphic Encryption.
          </p>

          <div className="mt-12">
            <button 
              onClick={handleLaunch}
              className="group relative inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-all hover:scale-105 active:scale-95"
            >
              Launch Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isLaunching ? 0 : 1, y: isLaunching ? 40 : 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 grid gap-6 md:grid-cols-3"
        >
          <Card 
            onClick={() => handleConnect('employer')}
            className="group cursor-pointer border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <CardHeader className="p-8">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-colors group-hover:bg-white/10 group-hover:text-white">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-medium tracking-tight text-white mb-2">Employer</CardTitle>
              <CardDescription className="text-sm text-zinc-500 font-light">
                Initialize encrypted payroll batches and manage employee rosters securely.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            onClick={() => handleConnect('employee')}
            className="group cursor-pointer border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <CardHeader className="p-8">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-colors group-hover:bg-white/10 group-hover:text-white">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-medium tracking-tight text-white mb-2">Employee</CardTitle>
              <CardDescription className="text-sm text-zinc-500 font-light">
                Access your zero-knowledge payout vault and decrypt incoming salary streams.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            onClick={() => handleConnect('treasurer')}
            className="group cursor-pointer border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 backdrop-blur-md overflow-hidden"
          >
            <CardHeader className="p-8">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-colors group-hover:bg-white/10 group-hover:text-white">
                <Vault className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-medium tracking-tight text-white mb-2">Treasurer</CardTitle>
              <CardDescription className="text-sm text-zinc-500 font-light">
                Approve FHE computes via multi-sig and verify solvency without data exposure.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
