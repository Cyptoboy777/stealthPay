'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Sparkles, Html, Text, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Shield, Sparkles as SparklesIcon, CreditCard, ChevronRight, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const vec = new THREE.Vector3();

function CameraController({ step }: { step: number }) {
  const { camera } = useThree();
  
  useFrame((state, delta) => {
    // Determine target position based on step
    let targetPos = new THREE.Vector3(0, 0, 15);
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    if (step === 0) {
      targetPos.set(0, 2, 8);
      targetLookAt.set(0, 0, 0);
    } else if (step === 1) {
      targetPos.set(0, 0, 3); // zoomed in
      targetLookAt.set(0, 0, 0);
    } else if (step === 2) {
      targetPos.set(-2, 1, 3.5); // focused on one node
      targetLookAt.set(-2, 1, 0);
    } else if (step === 3) {
      targetPos.set(-2, 1, 2); // very close
      targetLookAt.set(-2, 1, 0);
    }

    // Smoothly animate camera
    camera.position.lerp(targetPos, 0.04);
    
    // Smoothly look at target
    const currentLookAt = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLookAt.lerp(targetLookAt, 0.04);
    camera.lookAt(currentLookAt);
  });

  return null;
}

function DataCubes({ step }: { step: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [explosion, setExplosion] = useState(0);

  useFrame((state) => {
    if (groupRef.current) {
         if (step === 0) {
            groupRef.current.rotation.y += 0.005;
            groupRef.current.rotation.x += 0.002;
            setExplosion(THREE.MathUtils.lerp(explosion, 0, 0.05));
         } else if (step >= 1) {
            groupRef.current.rotation.y += 0.05;
            setExplosion(THREE.MathUtils.lerp(explosion, 1, 0.03));
         }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Batch */}
      <mesh visible={step === 0}>
         <boxGeometry args={[2, 2, 2]} />
         <meshPhysicalMaterial 
            color="#06b6d4" 
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            transmission={0.9} 
            opacity={1} 
            metalness={0.8} 
            roughness={0.1} 
            ior={1.5} 
            thickness={2} 
            wireframe={false}
         />
      </mesh>
      <mesh visible={step === 0} scale={1.05}>
           <boxGeometry args={[2, 2, 2]} />
           <meshStandardMaterial color="#c084fc" wireframe opacity={0.3} transparent />
      </mesh>
      
      {/* Explosion Particles */}
      <Sparkles 
         count={step >= 1 ? 800 : 0} 
         scale={[explosion * 15, explosion * 15, explosion * 15]} 
         size={2.5} 
         color="#c084fc" 
         speed={0.5} 
         opacity={step >= 1 ? 1 - explosion * 0.4 : 0} 
      />
      <Sparkles 
         count={step >= 1 ? 400 : 0} 
         scale={[explosion * 10, explosion * 10, explosion * 10]} 
         size={1.5} 
         color="#06b6d4" 
         speed={0.8} 
         opacity={step >= 1 ? 1 - explosion * 0.5 : 0} 
      />
    </group>
  );
}

function EmployeeNodeFocused({ step }: { step: number }) {
    const shieldRef = useRef<THREE.Mesh>(null);
    const avatarRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (avatarRef.current) {
            avatarRef.current.rotation.x += 0.02;
            avatarRef.current.rotation.y += 0.03;
        }
        if (shieldRef.current) {
            if (step === 3) {
                // Shield opens up or fades slightly
                (shieldRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp((shieldRef.current.material as THREE.MeshStandardMaterial).opacity, 0.05, 0.05);
                shieldRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.05);
            } else {
                 (shieldRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp((shieldRef.current.material as THREE.MeshStandardMaterial).opacity, 0.4, 0.05);
                 shieldRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
            }
        }
    })

    return (
        <group position={[-2, 1, 0]}>
             <mesh ref={avatarRef} visible={step >= 2}>
                <octahedronGeometry args={[0.25]} />
                <meshPhysicalMaterial 
                    color="#10b981" 
                    emissive="#34d399" 
                    emissiveIntensity={1.5} 
                    roughness={0.1}
                    metalness={0.9}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>
            <mesh ref={shieldRef} visible={step >= 2}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshPhysicalMaterial 
                    color="#34d399" 
                    emissive="#059669"
                    emissiveIntensity={0.2}
                    transmission={0.9} 
                    opacity={1} 
                    transparent 
                    roughness={0.1}
                    metalness={0.5}
                    ior={1.2}
                    thickness={0.5}
                />
            </mesh>
            <mesh visible={step >= 2 && step < 3} scale={1.1}>
                 <sphereGeometry args={[0.5, 16, 16]} />
                 <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.15} />
            </mesh>
        </group>
    )
}

export default function Walkthrough() {
  const [step, setStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  const reset = () => setStep(0);

  if (!isMounted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#020008] text-cyan-500 font-mono text-sm tracking-widest uppercase animate-pulse">
        Initializing 3D Engine...
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[#020008] text-cyan-55 font-sans overflow-hidden">
        {/* Subtle Scanline Overlay for Cyberpunk Feel (HTML level) */}
        <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>

        {/* 3D Scene */}
        <div className="absolute inset-0 z-0">
            <Canvas gl={{ antialias: false }}>
                <color attach="background" args={['#020008']} />
                <CameraController step={step} />
                <fog attach="fog" args={['#020008', 5, 25]} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={3} color="#22d3ee" />
                <pointLight position={[-5, 0, 5]} intensity={4} color="#c084fc" />
                <pointLight position={[0, -5, -5]} intensity={2} color="#34d399" />
                
                <Stars radius={50} depth={50} count={4000} factor={4} saturation={1} fade speed={1} />
                <DataCubes step={step} />
                <EmployeeNodeFocused step={step} />
                
                <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
                      <group position={[4, -2, -3]}>
                           <mesh>
                                <octahedronGeometry args={[1.2]} />
                                <meshPhysicalMaterial color="#c084fc" transmission={0.9} opacity={1} roughness={0.1} thickness={2} ior={1.5} />
                           </mesh>
                           <mesh scale={1.05}>
                                <octahedronGeometry args={[1.2]} />
                                <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.2} />
                           </mesh>
                      </group>
                </Float>

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[-4, 3, -5]}>
                    <mesh>
                         <torusGeometry args={[0.8, 0.2, 16, 32]} />
                         <meshPhysicalMaterial color="#22d3ee" transmission={0.8} opacity={1} roughness={0.2} metalness={0.5} />
                    </mesh>
                </Float>

                <EffectComposer enableNormalPass={false}>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
                    <Scanline blendFunction={BlendFunction.OVERLAY} density={1.5} opacity={0.05} />
                    <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.001, 0.001)} />
                </EffectComposer>
            </Canvas>
        </div>

        {/* 2D Overlay UI */}
        <div className="relative z-10 w-full h-full min-h-[calc(100vh-4rem)] pointer-events-none flex flex-col justify-end p-8 md:p-16">
            
            <AnimatePresence mode="wait">
                {step === 0 && (
                     <motion.div 
                        key="step0"
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        className="max-w-md pointer-events-auto backdrop-blur-md bg-[#02050A]/40 p-8 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden"
                     >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-transparent"></div>
                          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 font-mono uppercase tracking-wider text-shadow-glow-cyan">1. The Treasury</h2>
                          <p className="text-cyan-100/70 mb-8 text-lg font-light leading-relaxed">
                              Employers initiate batched payroll. Data is exposed in traditional systems, but here it's ready to be <strong className="text-cyan-300 font-normal">cryptographically shielded</strong> via Fhenix CoFHE.
                          </p>
                          <button 
                            onClick={nextStep}
                            className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-lg bg-cyan-950/50 border border-cyan-500/55 px-8 font-medium text-cyan-300 transition-all duration-300 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-cyan-400 cursor-pointer"
                        >
                             <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                  <div className="relative h-full w-8 bg-white/10"></div>
                             </div>
                             <span className="relative z-10 flex items-center gap-3 tracking-widest uppercase text-sm">
                                 Encrypt & Disperse <Lock size={16} className="group-hover:scale-110 transition-transform" />
                             </span>
                        </button>
                     </motion.div>
                )}

                {step === 1 && (
                     <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        className="max-w-md pointer-events-auto backdrop-blur-md bg-[#02050A]/40 p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden"
                     >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent"></div>
                          <h2 className="text-3xl font-bold text-purple-400 mb-4 font-mono uppercase tracking-wider flex items-center gap-3 text-shadow-glow-purple">
                            <SparklesIcon className="animate-spin-slow text-purple-300" /> Engine Active
                        </h2>
                          <p className="text-purple-100/70 mb-8 text-lg font-light leading-relaxed">
                              FHE conditionals branch the data. The batch explodes into <strong className="text-purple-300 font-normal">ERC-5564 Stealth Addresses</strong>. No one can see who gets what.
                          </p>
                          <button 
                            onClick={nextStep}
                            className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-lg bg-purple-950/50 border border-purple-500/55 px-8 font-medium text-purple-300 transition-all duration-300 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:border-purple-400 cursor-pointer"
                        >
                             <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                  <div className="relative h-full w-8 bg-white/10"></div>
                             </div>
                             <span className="relative z-10 flex items-center gap-3 tracking-widest uppercase text-sm">
                                 Follow Payout <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                             </span>
                        </button>
                     </motion.div>
                )}

                 {step === 2 && (
                     <motion.div 
                        key="step2"
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        className="max-w-md pointer-events-auto backdrop-blur-md bg-[#02050A]/40 p-8 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
                     >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent"></div>
                          <h2 className="text-3xl font-bold text-emerald-400 mb-4 font-mono uppercase tracking-wider flex items-center gap-3 text-shadow-glow-emerald">
                            <Shield className="animate-pulse text-emerald-300" /> Stealth Node
                        </h2>
                          <p className="text-emerald-100/70 mb-8 text-lg font-light leading-relaxed">
                              The transaction arrives at your stealth wallet. With <strong className="text-emerald-300 font-normal">ERC-4337 Account Abstraction</strong>, you claim it gaslessly. To the blockchain, it's pure noise.
                          </p>
                          <button 
                            onClick={nextStep}
                            className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-lg bg-emerald-950/50 border border-emerald-500/55 px-8 font-medium text-emerald-300 transition-all duration-300 hover:bg-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:border-emerald-400 cursor-pointer"
                        >
                             <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                  <div className="relative h-full w-8 bg-white/10"></div>
                             </div>
                             <span className="relative z-10 flex items-center gap-3 tracking-widest uppercase text-sm">
                                 Decrypt Private Claim <CreditCard size={16} />
                             </span>
                        </button>
                     </motion.div>
                )}

                {step === 3 && (
                     <motion.div 
                        key="step3"
                        initial={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(20px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        className="pointer-events-auto absolute inset-0 flex items-center justify-center"
                     >
                          <div className="relative">
                             {/* Glowing backdrop */}
                             <div className="absolute -inset-4 blur-3xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 opacity-30 animate-pulse"></div>
                             
                             {/* Holographic Card with Glassmorphism */}
                             <div className="relative w-96 rounded-2xl border border-cyan-400/40 bg-black/40 p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden group">
                                 {/* Angled reflection highlight */}
                                 <div className="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-overlay group-hover:animate-shine"></div>

                                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"></div>
                                 <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80"></div>
                                 <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-cyan-400 via-transparent to-transparent opacity-50"></div>
                                 
                                 <div className="relative z-10 flex justify-between items-start mb-12">
                                     <div className="h-10 w-14 bg-gradient-to-br from-yellow-200/90 via-yellow-400/90 to-yellow-600/90 rounded-md shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center justify-center border border-yellow-300/55">
                                         <div className="w-8 h-6 border border-yellow-200/50 rounded flex flex-col justify-around py-[2px] px-1">
                                             <div className="w-full h-[1px] bg-yellow-200/50"></div>
                                             <div className="w-full h-[1px] bg-yellow-200/50"></div>
                                             <div className="w-full h-[1px] bg-yellow-200/50"></div>
                                         </div>
                                     </div>
                                     <Shield className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" size={28} />
                                 </div>
                                 
                                 <div className="relative z-10 space-y-2 mb-10">
                                     <p className="text-xs text-cyan-400/80 font-mono tracking-[0.2em] uppercase">Decrypted Payout</p>
                                     <div className="flex items-baseline gap-2">
                                         <p className="text-5xl font-light text-white tracking-tight drop-shadow-md">$5,240<span className="text-3xl text-white/70">.00</span></p>
                                         <span className="text-sm text-cyan-500/80 font-bold tracking-wider">USDC</span>
                                     </div>
                                 </div>
                                 
                                 <div className="relative z-10 flex justify-between items-end font-mono text-xs border-t border-cyan-500/20 pt-6">
                                      <div className="space-y-1.5">
                                           <p className="text-cyan-400/50 uppercase tracking-widest text-[10px]">Employee ID</p>
                                           <p className="text-cyan-100/90 tracking-wider">0x7F...3B92</p>
                                      </div>
                                      <div className="space-y-1.5 text-right">
                                           <p className="text-cyan-400/50 uppercase tracking-widest text-[10px]">Network Status</p>
                                           <div className="flex items-center justify-end gap-1.5">
                                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,1)]"></div>
                                               <p className="text-emerald-400 tracking-wider">VERIFIED</p>
                                           </div>
                                      </div>
                                 </div>
                             </div>
                          </div>
                          
                          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-4 w-full max-w-xs pointer-events-auto">
                              <button 
                                 onClick={() => router.push('/employee')}
                                 className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-8 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] cursor-pointer tracking-widest"
                              >
                                  <div className="absolute inset-0 bg-white/20 group-hover:animate-shine mix-blend-overlay"></div>
                                  <span className="relative z-10 flex items-center gap-3">
                                      ENTER DASHBOARD <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                  </span>
                              </button>
                              
                              <button 
                                 onClick={reset}
                                 className="text-cyan-500/60 hover:text-cyan-300 font-mono text-xs tracking-widest uppercase transition-colors flex justify-center items-center gap-2 group pointer-events-auto"
                              >
                                 <span className="w-6 h-[1px] bg-cyan-500 group-hover:scale-x-150 transition-transform"></span>
                                 Replay Sequence
                              </button>
                          </div>
                      </motion.div>
                )}
            </AnimatePresence>
            
            {/* Progress indicators - Cyberpunk style */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
                 {[0,1,2,3].map((i) => (
                      <button 
                         key={i} 
                         onClick={() => setStep(i)}
                         className={`relative h-1 w-12 overflow-hidden transition-all duration-300 ${step === i ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : typeof step === 'number' && i < step ? 'bg-cyan-800' : 'bg-gray-800/50 hover:bg-gray-700'}`}
                      >
                           {step === i && (
                               <motion.div 
                                  className="absolute top-0 left-0 h-full bg-white hidden"
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 5 }}
                               />
                           )}
                      </button>
                 ))}
            </div>

        </div>
    </div>
  );
}
