import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, Fingerprint, ShieldCheck } from 'lucide-react';

export default function PasskeyAuthModal({ 
  isOpen, 
  onSuccess, 
  onCancel 
}: { 
  isOpen: boolean, 
  onSuccess: () => void,
  onCancel: () => void
}) {
  const [step, setStep] = useState<'scan' | 'verifying' | 'success'>('scan');

  useEffect(() => {
    if (isOpen) {
      setStep('scan');
      const timer1 = setTimeout(() => setStep('verifying'), 1500);
      const timer2 = setTimeout(() => setStep('success'), 3000);
      const timer3 = setTimeout(() => {
        onSuccess();
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="relative w-full max-w-sm bg-[#02050A] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-8 overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Cyberpunk Scanline */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAiLz4KPHBhdGggZD0iTTAgMEg0djFIMHoiIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>

          <button onClick={onCancel} className="absolute top-4 right-4 text-cyan-500/50 hover:text-cyan-400 font-mono text-xs z-10">CANCEL</button>

          <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
            <h3 className="text-cyan-400 font-mono text-lg tracking-widest text-shadow-glow-cyan uppercase">Biometric Auth</h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center">
               {/* Animated rings */}
               <motion.div 
                 className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               />
               <motion.div 
                 className="absolute inset-2 border border-purple-500/30 rounded-full"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               />
               
               {step === 'scan' && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                 >
                    <ScanFace className="w-16 h-16 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                 </motion.div>
               )}

               {step === 'verifying' && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                 >
                    <Fingerprint className="w-16 h-16 text-purple-400 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                 </motion.div>
               )}

               {step === 'success' && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                 >
                    <ShieldCheck className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                 </motion.div>
               )}

               {/* Scanning line */}
               {(step === 'scan' || step === 'verifying') && (
                 <motion.div 
                   className="absolute top-0 w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]"
                   animate={{ y: [0, 128, 0] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 />
               )}
            </div>

            <div className="text-center font-mono h-6">
              {step === 'scan' && <p className="text-cyan-300/80 text-sm animate-pulse">Scanning identity...</p>}
              {step === 'verifying' && <p className="text-purple-300/80 text-sm animate-pulse">Verifying cryptographic proof...</p>}
              {step === 'success' && <p className="text-emerald-400 text-sm font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]">Access Granted</p>}
            </div>

            <div className="w-full bg-cyan-950/30 h-1 rounded-full overflow-hidden">
               <motion.div 
                 className={`h-full ${step === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                 initial={{ width: '0%' }}
                 animate={{ width: step === 'scan' ? '30%' : step === 'verifying' ? '70%' : '100%' }}
                 transition={{ duration: 0.5 }}
               />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
