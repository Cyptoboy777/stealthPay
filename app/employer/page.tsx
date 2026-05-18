'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/Table';
import { ShieldAlert, Upload, Users, CheckCircle2, Activity, Cpu, Lock } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';
import { useWeb3 } from '@/src/lib/Web3Context';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockChartData = Array.from({ length: 20 }).map((_, i) => ({
  value: Math.random() * 100 + 50 + Math.sin(i / 2) * 20,
}));

export default function EmployerDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const { signer, payrollState, setPayrollState, employerSignature, setEmployerSignature } = useWeb3();

  const uploaded = payrollState !== 'idle';
  const signature = employerSignature;

  const handleUpload = async () => {
    if (!signer) {
      alert("Please connect wallet first.");
      return;
    }
    setIsUploading(true);
    try {
      const message = "STEALTHPAY: Authorize encrypted payroll batch dispatch for processing on Fhenix testnet. Payload: [ENCRYPTED_CSV_HASH_XYZ123]";
      const sig = await signer.signMessage(message);
      setEmployerSignature(sig);
      setPayrollState('uploaded');
    } catch (error) {
      console.error("Encryption/Signing rejected", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto mt-4 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-purple-500/20 pb-4 mb-8">
        <div>
          <h2 className="text-4xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            EMPLOYER_NODE
          </h2>
          <p className="text-purple-200/60 font-mono text-sm mt-1 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400"/> Status: Active & Encrypted
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
           <div className="px-3 py-1 bg-black/50 border border-purple-500/30 rounded-md font-mono text-xs text-purple-300 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]">
             <span className="w-2 h-2 inline-block rounded-full bg-emerald-400 animate-pulse mr-2" />
             Fhenix Subnet Connected
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="bg-[#05030A]/90 backdrop-blur-xl border-purple-500/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 border-b border-purple-500/10">
              <CardTitle className="text-xs uppercase tracking-widest text-purple-300 font-mono font-bold flex items-center gap-2">
                 <ShieldAlert className="h-4 w-4 text-emerald-400" />
                 Total Encrypted Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
              <div className="text-3xl font-bold font-mono text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                ********* <span className="text-xl text-purple-400">USDC</span>
              </div>
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3"/> Stored securely on Fhenix
              </p>
            </CardContent>
             {/* Holographic background chart */}
             <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity duration-700">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#c084fc" fillOpacity={1} fill="url(#colorPurple)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="bg-[#030610]/90 backdrop-blur-xl border-cyan-500/20 shadow-[0_4px_30px_rgba(6,182,212,0.1)] relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 border-b border-cyan-500/10">
              <CardTitle className="text-xs uppercase tracking-widest text-cyan-300 font-mono font-bold flex items-center gap-2">
                 <Users className="h-4 w-4 text-cyan-400" />
                 Active Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
              <div className="text-3xl font-bold font-mono text-white">12 <span className="text-lg font-mono text-cyan-500/50">Nodes</span></div>
              <p className="text-xs text-cyan-200/50 mt-2 font-mono">Contractors & Full-time</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="bg-[#0A0505]/90 backdrop-blur-xl border-amber-500/20 shadow-[0_4px_30px_rgba(245,158,11,0.1)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 border-b border-amber-500/10">
              <CardTitle className="text-xs uppercase tracking-widest text-amber-300 font-mono font-bold flex items-center gap-2">
                 <Activity className="h-4 w-4 text-amber-400" />
                 Pending Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
              <div className="text-3xl font-bold font-mono text-white">2 <span className="text-lg font-mono text-amber-500/50">Batches</span></div>
              <p className="text-xs text-amber-200/50 mt-2 font-mono">Awaiting Treasury Multisig</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:mt-12">
        <Card className="bg-[#05030A]/80 backdrop-blur-xl border-purple-500/30 overflow-hidden relative shadow-[0_0_50px_rgba(168,85,247,0.05)]">
          {/* Subtle animated border top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
          
          <CardHeader className="border-b border-purple-500/10 bg-black/40">
            <CardTitle className="font-mono text-purple-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400"/> INIT_BATCH_UPLOAD
            </CardTitle>
            <CardDescription className="font-mono text-xs text-purple-300/50">
              Inject CSV payload. Client-side encryption active. Zero server exposure.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 relative">
             <AnimatePresence mode="wait">
              {!uploaded ? (
                 <motion.div 
                   key="upload"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                   className="border border-purple-500/30 border-dashed rounded-xl p-10 text-center bg-purple-950/10 relative overflow-hidden group hover:border-purple-400/50 transition-colors"
                 >
                   <div className="absolute inset-0 bg-transparent group-hover:bg-purple-500/5 transition-colors duration-500" />
                   <Upload className="mx-auto h-12 w-12 text-purple-500/70 mb-4 group-hover:text-purple-400 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                   <p className="text-sm font-bold text-purple-100 font-mono tracking-widest uppercase mb-2">Drop Payroll Matrix Here</p>
                   <p className="text-xs text-purple-300/50 mb-6 font-mono">CoFHE runtime will scramble contents locally</p>
                   <Button 
                     onClick={handleUpload} 
                     disabled={isUploading}
                     className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-100 border border-purple-500/55 font-mono shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                   >
                     {isUploading ? (
                       <span className="flex items-center gap-2">
                         <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                         Generating Proof...
                       </span>
                     ) : (
                       "[ EXECUTE_ENCRYPTION ]"
                     )}
                   </Button>
                 </motion.div>
              ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    className="border border-cyan-500/30 rounded-xl p-8 bg-cyan-950/20 flex flex-col gap-4 shadow-[inset_0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden"
                  >
                    {/* Simulated data stream background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none data-stream-bg"></div>

                    <div className="flex items-start gap-4 relative z-10">
                      <div className="h-12 w-12 bg-cyan-500/20 rounded-xl border border-cyan-500/50 flex justify-center items-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        <CheckCircle2 className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-cyan-100 font-mono tracking-wide">PAYLOAD_ENCRYPTED_SUCCESS</h4>
                        <p className="text-cyan-400/80 text-sm font-mono mt-1">Batch dispatched to Treasury smart contract for Multi-Sig.</p>
                      </div>
                    </div>
                    {signature && (
                      <div className="mt-4 p-3 bg-black/60 rounded-lg text-xs text-cyan-400/60 font-mono break-all border border-cyan-500/20 relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                        <span className="text-cyan-500 mr-2">SIG_HASH:</span>
                        <span className="group-hover:text-cyan-300 transition-colors">{signature}</span>
                      </div>
                    )}
                  </motion.div>
              )}
             </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="bg-[#02050A]/80 backdrop-blur-xl border-cyan-500/20 max-h-[500px] overflow-hidden flex flex-col">
          <CardHeader className="border-b border-cyan-500/10 bg-black/40 shrink-0">
            <CardTitle className="font-mono text-cyan-100 flex items-center gap-2">
               <Activity className="w-5 h-5 text-cyan-400" /> DISPATCH_LOGS
            </CardTitle>
            <CardDescription className="font-mono text-xs text-cyan-300/50"> Immutable record of encrypted state changes.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1 custom-scrollbar">
            <Table>
              <TableHeader className="bg-cyan-950/30 sticky top-0 backdrop-blur-md">
                <TableRow className="border-cyan-500/20 hover:bg-cyan-900/20">
                  <TableHead className="font-mono text-cyan-400/70">BATCH_HASH</TableHead>
                  <TableHead className="font-mono text-cyan-400/70">STATE</TableHead>
                  <TableHead className="font-mono text-cyan-400/70 text-right">NODES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploaded && (
                  <TableRow className="border-cyan-500/10 hover:bg-cyan-500/5 transition-colors bg-cyan-950/10">
                    <TableCell className="font-mono text-cyan-100">#BP_0992</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded-sm font-mono text-[10px]">AWAITING_SIG</Badge>
                    </TableCell>
                    <TableCell className="text-right text-cyan-300/70 font-mono">1</TableCell>
                  </TableRow>
                )}
                <TableRow className="border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                  <TableCell className="font-mono text-cyan-100">#BP_0991</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded-sm font-mono text-[10px]">AWAITING_SIG</Badge>
                  </TableCell>
                  <TableCell className="text-right text-cyan-300/70 font-mono">8</TableCell>
                </TableRow>
                <TableRow className="border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                  <TableCell className="font-mono text-cyan-400/50 line-through decoration-cyan-500/30">#BP_0990</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] rounded-sm font-mono text-[10px]">VERIFIED</Badge>
                  </TableCell>
                  <TableCell className="text-right text-cyan-300/40 font-mono">12</TableCell>
                </TableRow>
                <TableRow className="border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                  <TableCell className="font-mono text-cyan-400/50 line-through decoration-cyan-500/30">#BP_0989</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] rounded-sm font-mono text-[10px]">VERIFIED</Badge>
                  </TableCell>
                  <TableCell className="text-right text-cyan-300/40 font-mono">12</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .data-stream-bg {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.2) 2px, rgba(6, 182, 212, 0.2) 4px);
          background-size: 100% 4px;
          animation: scanlines 10s linear infinite;
        }
        @keyframes scanlines {
          from { background-position: 0 0; }
          to { background-position: 0 -100px; }
        }
      `}</style>
    </div>
  );
}
