'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Lock, Cpu, Shield, CheckCircle, ChevronRight, Terminal, RotateCcw } from 'lucide-react';

// Custom camera controller targeting nodes in 3D viewport
function CameraController({ step }: { step: number }) {
  const { camera } = useThree();
  
  useFrame(() => {
    let targetPos = new THREE.Vector3(0, 0, 10);
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    if (step === 0) {
      targetPos.set(0, 1.5, 7.5);
      targetLookAt.set(0, 0, 0);
    } else if (step === 1) {
      targetPos.set(0, 0, 3.5); // zoomed in closely
      targetLookAt.set(0, 0, 0);
    } else if (step === 2) {
      targetPos.set(-2, 0.8, 3.2); // focus stealth node
      targetLookAt.set(-2, 0.8, 0);
    } else if (step === 3) {
      targetPos.set(-2, 0.8, 1.8); // hyper close focus
      targetLookAt.set(-2, 0.8, 0);
    }

    // Smoothly interpolate position and target
    camera.position.lerp(targetPos, 0.04);
    
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLookAt.lerp(targetLookAt, 0.04);
    camera.lookAt(currentLookAt);
  });

  return null;
}

// 3D Cubes representing Batched Ciphertext Payloads
function DataCubes({ step }: { step: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [explosion, setExplosion] = useState(0);

  useFrame(() => {
    if (groupRef.current) {
      if (step === 0) {
        groupRef.current.rotation.y += 0.005;
        groupRef.current.rotation.x += 0.002;
        setExplosion(THREE.MathUtils.lerp(explosion, 0, 0.05));
      } else {
        groupRef.current.rotation.y += 0.04;
        setExplosion(THREE.MathUtils.lerp(explosion, 1, 0.03));
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Shielded Block */}
      <mesh visible={step === 0}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshPhysicalMaterial 
          color="#06b6d4" 
          emissive="#06b6d4"
          emissiveIntensity={0.6}
          transmission={0.9} 
          opacity={1} 
          metalness={0.85} 
          roughness={0.1} 
          ior={1.5} 
          thickness={1.5} 
        />
      </mesh>
      
      {/* Wireframe outer shell */}
      <mesh visible={step === 0} scale={1.05}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color="#c084fc" wireframe opacity={0.35} transparent />
      </mesh>
      
      {/* Explosion/Dispersion particles */}
      <Sparkles 
        count={step >= 1 ? 600 : 0} 
        scale={[explosion * 12, explosion * 12, explosion * 12]} 
        size={2.5} 
        color="#c084fc" 
        speed={0.6} 
        opacity={step >= 1 ? 1 - explosion * 0.45 : 0} 
      />
      <Sparkles 
        count={step >= 1 ? 300 : 0} 
        scale={[explosion * 8, explosion * 8, explosion * 8]} 
        size={1.5} 
        color="#06b6d4" 
        speed={0.9} 
        opacity={step >= 1 ? 1 - explosion * 0.55 : 0} 
      />
    </group>
  );
}

// 3D Shielded Stealth Receiver Wallet
function EmployeeNodeFocused({ step }: { step: number }) {
  const shieldRef = useRef<THREE.Mesh>(null);
  const avatarRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (avatarRef.current) {
      avatarRef.current.rotation.x += 0.015;
      avatarRef.current.rotation.y += 0.025;
    }
    if (shieldRef.current) {
      if (step === 3) {
        (shieldRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp(
          (shieldRef.current.material as THREE.MeshStandardMaterial).opacity, 0.04, 0.05
        );
        shieldRef.current.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.05);
      } else {
        (shieldRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp(
          (shieldRef.current.material as THREE.MeshStandardMaterial).opacity, 0.35, 0.05
        );
        shieldRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    }
  });

  return (
    <group position={[-2, 0.8, 0]}>
      {/* Node Core */}
      <mesh ref={avatarRef} visible={step >= 2}>
        <octahedronGeometry args={[0.22]} />
        <meshPhysicalMaterial 
          color="#10b981" 
          emissive="#34d399" 
          emissiveIntensity={1.8} 
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
        />
      </mesh>
      
      {/* Shield Dome */}
      <mesh ref={shieldRef} visible={step >= 2}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshPhysicalMaterial 
          color="#34d399" 
          emissive="#059669"
          emissiveIntensity={0.2}
          transmission={0.85} 
          opacity={0.35} 
          transparent 
          roughness={0.1}
          metalness={0.4}
          ior={1.2}
          thickness={0.4}
        />
      </mesh>
      
      {/* Target scanning lines */}
      <mesh visible={step >= 2 && step < 3} scale={1.12}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function WalkthroughSection() {
  const [step, setStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => setStep(0);

  const stepContents = [
    {
      title: "1. The Encrypted Batch",
      subtitle: "TREASURY_DISPERSION",
      description: "Employers initiate batch payroll execution. In typical ledger networks, transaction endpoints and sums are publicly exposed. On StealthPay, the raw input is cryptographically sealed via Fhenix CoFHE.",
      badge: "FHENIX_CoFHE_ACTIVE",
      buttonText: "Encrypt & Disperse Payload",
    },
    {
      title: "2. Stealth Address Routing",
      subtitle: "DISCRETE_DISPERSION",
      description: "CoFHE conditionals split the ciphertext payload into ERC-5564 Stealth Addresses. The on-chain payout registers strictly as cryptographic noise, preventing any strategy leaks or volume tracking.",
      badge: "ERC-5564_STEALTH_PROTOCOL",
      buttonText: "Trace Shielded Stream",
    },
    {
      title: "3. Account Abstraction Vault",
      subtitle: "GASLESS_CLAIM_GATE",
      description: "The shielded stream arrives securely at your private, one-time stealth wallet. Enabled by ERC-4337 Account Abstraction, users execute gasless decryption and claims, retaining absolute operational security.",
      badge: "ERC-4337_ZK_PROOF_VERIFY",
      buttonText: "Decrypt Private Claim",
    },
    {
      title: "4. Decrypted Private Vault",
      subtitle: "SECURE_LIQUIDITY_RESOLVED",
      description: "The ciphertext payload is unlocked inside your client-side session using homomorphic decryption keys. Your actual wage and address remain entirely hidden from searchers, MEV bots, and onlookers.",
      badge: "STREAM_DECRYPTED_SUCCESS",
      buttonText: "Replay Stream Simulation",
    }
  ];

  const activeContent = stepContents[step];

  return (
    <section 
      id="3d-walkthrough" 
      className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-32 relative z-10 flex flex-col items-center"
    >
      {/* Title Header */}
      <div className="text-center space-y-4 mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>SYSTEM_SANDBOX // CRYPTO_VISUALIZER</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-400">
          Protocol Stream Walkthrough
        </h2>
        
        <p className="text-cyan-100/60 font-light text-base md:text-lg">
          Interact with our live 3D engine simulator to trace how batched payroll disperses gaslessly and confidentially across stealth addresses.
        </p>
      </div>

      {/* Main Console Layout Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px]">
        
        {/* Left Column: Holographic 3D Simulator Port */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-3xl border border-cyan-500/20 bg-[#020306]/95 relative overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Tech HUD Corner Accents */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-cyan-500/30"></div>
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-cyan-500/30"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-cyan-500/30"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-cyan-500/30"></div>
          
          <div className="w-full px-6 py-4 flex justify-between items-center border-b border-cyan-500/10 font-mono text-[9px] text-cyan-500/40 bg-[#02050A]/40">
            <span className="uppercase tracking-widest">HOLO_RENDER // RECEIVER_NODE_V4</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              PORT_ONLINE
            </span>
          </div>

          <div className="flex-1 w-full relative min-h-[350px] lg:min-h-[400px]">
            {isMounted ? (
              <Canvas gl={{ antialias: false }}>
                <color attach="background" args={['#020206']} />
                <CameraController step={step} />
                <fog attach="fog" args={['#020206', 4, 18]} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 8, 5]} intensity={2.5} color="#22d3ee" />
                <pointLight position={[-4, 0, 4]} intensity={3.5} color="#c084fc" />
                <pointLight position={[0, -4, -4]} intensity={2} color="#34d399" />
                
                <Stars radius={40} depth={40} count={2000} factor={3.5} saturation={1} fade speed={1.2} />
                <DataCubes step={step} />
                <EmployeeNodeFocused step={step} />
                
                {/* Background Float Elements for Depth */}
                <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
                  <group position={[3.5, -1.8, -2.5]}>
                    <mesh>
                      <octahedronGeometry args={[0.9]} />
                      <meshPhysicalMaterial color="#c084fc" transmission={0.95} opacity={1} roughness={0.1} thickness={1.2} ior={1.5} />
                    </mesh>
                    <mesh scale={1.05}>
                      <octahedronGeometry args={[0.9]} />
                      <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.15} />
                    </mesh>
                  </group>
                </Float>

                <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4} position={[-3.5, 2.5, -4]}>
                  <mesh>
                    <torusGeometry args={[0.6, 0.15, 12, 24]} />
                    <meshPhysicalMaterial color="#22d3ee" transmission={0.8} opacity={1} roughness={0.2} metalness={0.5} />
                  </mesh>
                </Float>

                <EffectComposer enableNormalPass={false}>
                  <Bloom luminanceThreshold={0.25} mipmapBlur intensity={1.2} radius={0.55} />
                  <Scanline blendFunction={BlendFunction.OVERLAY} density={1.2} opacity={0.04} />
                  <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0008, 0.0008)} />
                </EffectComposer>
              </Canvas>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-cyan-500/40 text-xs uppercase tracking-widest bg-[#020206] animate-pulse">
                Booting Holographic Interface...
              </div>
            )}
          </div>

          <div className="w-full px-6 py-3 border-t border-cyan-500/10 font-mono text-[9px] text-cyan-500/40 bg-[#02050A]/40 flex justify-between items-center">
            <span>CIPHERTEXT_STATE: {step === 3 ? 'DECRYPTED' : 'ENCRYPTED'}</span>
            <span>SYSTEM: STREAMING_ACTIVE</span>
          </div>
        </div>

        {/* Right Column: Cyberpunk Control Console */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          {/* Progress Timeline Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === i 
                    ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]' 
                    : step > i 
                      ? 'bg-purple-500' 
                      : 'bg-cyan-950/40 border border-cyan-500/10'
                }`}
              />
            ))}
          </div>

          {/* Details Console Panel */}
          <div className="flex-1 rounded-3xl border border-cyan-500/25 bg-purple-950/5 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex-1 flex flex-col"
              >
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded text-[9px] font-mono uppercase tracking-widest border ${
                    step === 0 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35' :
                    step === 1 ? 'bg-purple-500/10 text-purple-400 border-purple-500/35' :
                    step === 2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35' :
                    'bg-cyan-500/10 text-cyan-400 border-cyan-500/35 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                  }`}>
                    {activeContent.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-purple-400/70 font-mono uppercase tracking-widest">
                    SYSTEM_ROUTINE // {activeContent.subtitle}
                  </p>
                  <h3 className={`text-2xl font-black tracking-tight font-sans text-white ${
                    step === 0 ? 'text-shadow-glow-cyan' :
                    step === 1 ? 'text-shadow-glow-purple' :
                    step === 2 ? 'text-shadow-glow-emerald' :
                    'text-shadow-glow-cyan'
                  }`}>
                    {activeContent.title}
                  </h3>
                </div>

                <p className="text-cyan-50/70 font-light leading-relaxed text-sm flex-1">
                  {activeContent.description}
                </p>

                {/* Secure Decrypted Credit Card inside Step 3 console */}
                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full rounded-2xl border border-cyan-400/30 bg-black/50 p-6 backdrop-blur-2xl shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden group perspective-1000 my-2"
                  >
                    {/* Glowing background */}
                    <div className="absolute -inset-4 blur-3xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 opacity-40"></div>
                    
                    {/* Angled reflection highlight */}
                    <div className="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay group-hover:animate-shine"></div>
                    
                    <div className="relative z-10 flex justify-between items-start mb-6">
                      <div className="h-7 w-10 bg-gradient-to-br from-yellow-200/90 via-yellow-400/90 to-yellow-600/90 rounded border border-yellow-300/40 flex items-center justify-center">
                        <div className="w-6 h-4 border border-yellow-200/30 rounded flex flex-col justify-around py-[1px] px-[2px]">
                          <div className="w-full h-[1px] bg-yellow-200/40"></div>
                          <div className="w-full h-[1px] bg-yellow-200/40"></div>
                        </div>
                      </div>
                      <Shield className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" size={20} />
                    </div>

                    <div className="relative z-10 space-y-1 mb-6">
                      <p className="text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase">Decrypted Wage Payout</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-light text-white tracking-tight">$5,240<span className="text-xl text-white/70">.00</span></span>
                        <span className="text-xs text-cyan-400 font-bold font-mono">USDC</span>
                      </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end font-mono text-[9px] border-t border-cyan-500/10 pt-4">
                      <div>
                        <p className="text-cyan-500/40 uppercase tracking-widest text-[8px]">RECIPIENT_HASH</p>
                        <p className="text-cyan-100/90">0x7F...3B92</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-500/40 uppercase tracking-widest text-[8px]">ROUTING_KEY</p>
                        <div className="flex items-center gap-1 justify-end">
                          <CheckCircle size={10} className="text-emerald-400" />
                          <span className="text-emerald-400">RESOLVED</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation / Action Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={step === 3 ? reset : nextStep}
                className={`group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl font-bold font-mono uppercase tracking-widest text-xs transition-all duration-300 border cursor-pointer ${
                  step === 3
                    ? 'border-purple-500/50 text-purple-300 bg-purple-950/30 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : step === 2
                      ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'border-cyan-500/50 text-cyan-300 bg-cyan-950/30 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {step === 3 ? (
                    <>Replay Simulation <RotateCcw className="w-3.5 h-3.5" /></>
                  ) : (
                    <>{activeContent.buttonText} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </button>

              <div className="flex gap-3 justify-between items-center text-[10px] font-mono text-cyan-500/40">
                <button
                  onClick={prevStep}
                  disabled={step === 0}
                  className="px-3 py-1 rounded border border-cyan-500/10 bg-[#02050A]/40 hover:bg-[#02050A] hover:text-cyan-400 hover:border-cyan-500/30 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                >
                  &lt;&lt; PREV
                </button>
                <span>PHASE_0{step + 1} // 04</span>
                <button
                  onClick={nextStep}
                  disabled={step === 3}
                  className="px-3 py-1 rounded border border-cyan-500/10 bg-[#02050A]/40 hover:bg-[#02050A] hover:text-cyan-400 hover:border-cyan-500/30 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                >
                  NEXT &gt;&gt;
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
