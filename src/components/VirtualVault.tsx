import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

function VaultCore({ isDecrypted, isClaiming }: { isDecrypted: boolean, isClaiming: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.5;
      coreRef.current.rotation.x = time * 0.2;
      
      if (isClaiming) {
        coreRef.current.scale.lerp(new THREE.Vector3(0.5, 0.5, 0.5), 0.1);
      } else {
        coreRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = time * (isClaiming ? 2 : 0.5);
    }
  });

  return (
    <group>
      {/* Central Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial 
          color={isDecrypted ? "#10b981" : "#a855f7"} 
          emissive={isDecrypted ? "#34d399" : "#c084fc"}
          emissiveIntensity={1}
          wireframe={!isDecrypted}
          transmission={0.9}
          opacity={1}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
        />
      </mesh>

      {/* Energy Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshBasicMaterial color={isClaiming ? "#34d399" : "#22d3ee"} transparent opacity={0.5} />
      </mesh>

      {/* Outer Cage */}
      <mesh>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Claiming Particles Stream */}
      {isClaiming && (
        <Sparkles 
          count={400} 
          scale={[5, 10, 5]} 
          position={[0, -5, 0]} 
          size={4}
          speed={2} 
          color="#34d399"
        />
      )}
    </group>
  );
}

function FloatingOrbs({ isDecrypted, isClaiming }: { isDecrypted: boolean, isClaiming: boolean }) {
  const orbs = useMemo(() => {
    return new Array(8).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      speed: Math.random() * 0.5 + 0.5
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && isClaiming) {
      groupRef.current.position.y -= 0.1;
      if (groupRef.current.position.y < -10) groupRef.current.position.y = 10;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={1} floatIntensity={2}>
          <mesh position={orb.position}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhysicalMaterial 
              color={isDecrypted ? "#34d399" : "#c084fc"} 
              emissive={isDecrypted ? "#10b981" : "#a855f7"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function VirtualVault({ 
  isDecrypted, 
  isClaiming 
}: { 
  isDecrypted: boolean, 
  isClaiming: boolean 
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] relative rounded-2xl overflow-hidden bg-[#010308] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center">
         <span className="text-[10px] text-cyan-500/50 font-mono tracking-widest uppercase animate-pulse">Booting Virtual Vault...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] relative rounded-2xl overflow-hidden bg-[#010308] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
       {/* Scanline Overlay */}
       <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
       
       <Canvas gl={{ antialias: false }} camera={{ position: [0, 0, 8] }}>
          <color attach="background" args={['#010308']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#22d3ee" />
          <pointLight position={[-10, -10, -10]} intensity={2} color="#c084fc" />
          
          <Stars radius={50} depth={50} count={2000} factor={4} saturation={1} fade speed={1} />
          
          <VaultCore isDecrypted={isDecrypted} isClaiming={isClaiming} />
          <FloatingOrbs isDecrypted={isDecrypted} isClaiming={isClaiming} />

          <EffectComposer enableNormalPass={false}>
             <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
             <Scanline blendFunction={BlendFunction.OVERLAY} density={1.5} opacity={0.1} />
             <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
          </EffectComposer>
       </Canvas>
    </div>
  );
}
