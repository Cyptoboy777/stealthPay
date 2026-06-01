import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function MinimalOrb() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Core encrypted data visual (subtle inner sphere) */}
        <Sphere args={[1.5, 64, 64]}>
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.03} />
        </Sphere>
        
        {/* Apple-style frosted glass orb */}
        <Sphere args={[2, 64, 64]}>
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={0.5}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#f4f4f5"
            resolution={1024}
          />
        </Sphere>
      </group>
    </Float>
  );
}

export default function HeroScene({ zooming = false }: { zooming?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 -z-10 w-full h-full bg-[#000000] overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <fog attach="fog" args={['#000000', 5, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#a1a1aa" />
        
        <MinimalOrb />
      </Canvas>
    </div>
  );
}
