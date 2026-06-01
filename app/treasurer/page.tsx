'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { Fingerprint, CheckCircle2, ShieldCheck, FileCheck, Loader2, Vault, Database, Shield } from 'lucide-react';
import { usePayrollStore } from '@/src/store/usePayrollStore';
import { useSignMessage, useAccount } from 'wagmi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function TreasuryVault() {
  const [approving, setApproving] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { payrollState, setPayrollState, treasurerSignature, setTreasurerSignature } = usePayrollStore();

  const approved = payrollState === 'approved' || payrollState === 'claimed';
  const signature = treasurerSignature;

  const handleApprove = async () => {
    if (!isConnected) {
      toast.error("Wallet Disconnected", { description: "Please connect your hardware wallet or signer account." });
      return;
    }
    if (payrollState === 'idle') {
      toast.warning("No Pending Batch", { description: "No pending payroll batch uploaded yet." });
      return;
    }
    setApproving(true);
    try {
      const msg = "Sign FHE encrypted payload to approve Batch Payroll #BP_0991.";
      const sig = await signMessageAsync({ account: address as `0x${string}`, message: msg });
      setTreasurerSignature(sig);
      setPayrollState('approved');
      toast.success("Multisig Authorized", { description: "Batch #BP_0991 successfully approved." });
    } catch (err) {
      console.error(err);
      toast.error("Approval Failed", { description: "Signature rejected or error occurred." });
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto mt-4 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-emerald-500/20 pb-4 mb-8">
        <div>
           <h2 className="text-4xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            TREASURY_MULTISIG
          </h2>
          <p className="text-emerald-200/60 font-mono text-sm mt-1 flex items-center gap-2">
            <Vault className="w-4 h-4 text-emerald-400"/> Status: Awaiting Quorum
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="gap-2 bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 font-mono text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300 h-10">
             <FileCheck className="h-4 w-4" />
             [GENERATE_ZKP_PROOF]
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 relative">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent absolute top-1/4" />
           <div className="w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent absolute left-1/3" />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400 }}>
            <Card className="bg-[#020A06]/90 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
              
              <CardHeader className="border-b border-emerald-500/10 bg-emerald-950/20">
                 <CardTitle className="text-emerald-400 font-mono text-lg flex items-center gap-2">
                   <Database className="w-5 h-5"/> PENDING_TRANSACTIONS
                 </CardTitle>
                 <CardDescription className="text-emerald-200/50 font-mono text-xs">Multisig required for encrypted specific FHE state transitions (2/3 quorum)</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                 <div className="p-6 border border-emerald-500/20 rounded-xl bg-black/60 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
                    {/* Scanning line effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent -translate-y-full hover:animate-[scan_2s_ease-in-out_infinite]" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                      <div>
                        <h4 className="font-bold text-xl flex items-center gap-3 text-emerald-50 font-mono">
                          #BP_0991_PAYLOAD
                          <AnimatePresence mode="wait">
                            {!approved ? (
                              <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded font-mono text-[10px]">AWAITING</Badge>
                              </motion.div>
                            ) : (
                              <motion.div key="approved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] rounded font-mono text-[10px]">VERIFIED (2/3)</Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </h4>
                        <p className="text-xs text-emerald-500/60 mt-1 font-mono">INITIATOR_HASH: 0x3d...F9A1 (2 HOURS AGO)</p>
                      </div>
                      <div className="sm:text-right bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/20">
                        <p className="text-[10px] uppercase tracking-widest text-emerald-500/70 font-mono mb-1">Encrypted Delta</p>
                        <p className="font-mono font-black text-2xl text-emerald-100 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">********</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">OK</div>
                      
                      <AnimatePresence mode="wait">
                        {!approved ? (
                          <motion.div key="wait" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="h-10 w-10 rounded-lg bg-[#0A0F11] flex items-center justify-center text-slate-600 font-mono border-2 border-dashed border-slate-700">?</motion.div>
                        ) : (
                          <motion.div key="ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">OK</motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="h-10 w-10 rounded-lg bg-[#0A0F11] flex items-center justify-center text-slate-600 font-mono border-2 border-dashed border-slate-700">?</div>
                      <span className="text-xs text-emerald-500/50 ml-2 font-mono tracking-widest">{approved ? 'QUORUM_MET-[2/3]' : 'AWAITING-[1/3]'}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {!approved ? (
                        <motion.div key="sign-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                          <Button 
                            className="w-full gap-3 h-12 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/55 font-mono tracking-widest text-sm shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300"
                            onClick={handleApprove} 
                            disabled={approving}
                          >
                            {approving ? <Loader2 className="h-5 w-5 animate-spin"/> : <Fingerprint className="h-5 w-5" />}
                            {approving ? "GENERATING_ZK_PROOF..." : "[ EXEC_M_SIG_APPROVE ]"}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div key="success-msg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 px-5 py-4 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500" />
                            <CheckCircle2 className="h-6 w-6 shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="font-mono text-sm tracking-wide">STATE_TRANSITION_AUTHORIZED</span>
                          </div>
                          {signature && (
                             <div className="p-3 bg-[#030605] rounded-xl text-[10px] text-emerald-600 font-mono break-all border border-emerald-500/20 relative group">
                               <span className="text-emerald-500 mr-2 group-hover:text-emerald-300 transition-colors">HKDF_SIG:</span>
                               {signature}
                             </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
            <Card className="h-full bg-[#02060A]/90 backdrop-blur-xl border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.05)] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              <CardHeader className="border-b border-cyan-500/10">
                 <CardTitle className="text-lg text-cyan-300 font-mono flex items-center gap-2">
                   <Shield className="w-5 h-5 text-cyan-400" /> COMPLIANCE_PROTOCOLS
                 </CardTitle>
                 <CardDescription className="text-cyan-200/40 text-[10px] font-mono tracking-wide">Zero-Knowledge succinct non-interactive arguments of knowledge (zk-SNARKs)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 relative z-10">
                <div className="flex gap-4 group/item cursor-crosshair">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-900/80 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <ShieldCheck className="h-5 w-5 text-cyan-400 group-hover/item:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-cyan-100 font-mono group-hover/item:text-cyan-300 transition-colors">Select_Disclosure</h5>
                    <p className="text-[10px] text-cyan-500/60 mt-1 font-mono leading-relaxed">Prove specific aggregate conditions to third-party auditors without decrypting granular row-level data streams.</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-cyan-500/10 flex gap-4 group/item cursor-crosshair">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-900/80 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Database className="h-5 w-5 text-emerald-400 group-hover/item:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-emerald-100 font-mono group-hover/item:text-emerald-300 transition-colors">Solvency_Enforcement</h5>
                    <p className="text-[10px] text-emerald-500/60 mt-1 font-mono leading-relaxed">FHE smart contracts natively prevent state transitions where aggregate payout vectors exceed current treasury limits.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
