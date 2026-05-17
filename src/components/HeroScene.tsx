import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function CameraController({ zooming, introPlaying }: { zooming: boolean, introPlaying?: boolean }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (introPlaying) {
      camera.position.set(0, 0, 45); // Start far away for the intro fly-in
    }
  }, [introPlaying, camera]);

  useFrame((state, delta) => {
    if (introPlaying) {
      // Fast fly-in from z=45 to z=12
      camera.position.lerp(new THREE.Vector3(0, 0, 12), 0.04);
    } else if (!zooming) {
      // Default slow forward movement
      camera.position.z -= delta * 0.2;
      if (camera.position.z < 2) camera.position.z = 12; // loop back
      camera.position.lerp(new THREE.Vector3(0, 0, camera.position.z), 0.05);
    } else {
      // Cinematic zoom into the vault (Launch clicked)
      camera.position.lerp(new THREE.Vector3(0, 0, -2), 0.03);
    }
  });
  return null;
}

function EncryptedGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Outer grid */}
        <Sphere args={[2.5, 64, 64]}>
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.08} />
        </Sphere>
        
        {/* Middle encrypted core */}
        <Sphere args={[2.2, 32, 32]}>
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.9}
            wireframe={true}
            emissive="#0891b2"
            emissiveIntensity={1.5}
          />
        </Sphere>

        {/* Inner glowing core */}
        <Sphere args={[1.6, 32, 32]}>
          <meshStandardMaterial color="#000000" emissive="#a855f7" emissiveIntensity={1} opacity={0.7} transparent />
        </Sphere>
      </group>
    </Float>
  );
}

function EmployeeNode({ position, color, iconRotationSpeed }: { position: [number, number, number], color: string, iconRotationSpeed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]*2) * 0.3;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += iconRotationSpeed;
      meshRef.current.rotation.y += iconRotationSpeed;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Employee Avatar (abstract) */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      
      {/* Privacy Shield */}
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} wireframe emissive={color} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Target ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function FloatingAvatars() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * -0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <EmployeeNode position={[-5, 2, -2]} color="#c084fc" iconRotationSpeed={0.02} />
      <EmployeeNode position={[5, -2, 1]} color="#22d3ee" iconRotationSpeed={-0.03} />
      <EmployeeNode position={[3, 4, -1]} color="#e879f9" iconRotationSpeed={0.01} />
      <EmployeeNode position={[-4, -3, -2]} color="#34d399" iconRotationSpeed={0.04} />
      <EmployeeNode position={[0, -4, 4]} color="#60a5fa" iconRotationSpeed={0.02} />
    </group>
  );
}

function TransactionStreams() {
  return (
    <group>
      {/* Encrypted transaction particle streams */}
      <Sparkles count={300} scale={[12, 12, 12]} size={1.5} color="#22d3ee" speed={0.4} opacity={0.5} />
      <Sparkles count={200} scale={[15, 6, 15]} size={2.5} color="#a855f7" speed={0.6} opacity={0.4} />
      <Sparkles count={150} scale={[6, 15, 6]} size={2} color="#34d399" speed={0.8} opacity={0.6} noise={0.2} />
    </group>
  );
}

export default function HeroScene({ zooming = false, introPlaying = false }: { zooming?: boolean, introPlaying?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="absolute inset-0 -z-10 w-full h-full bg-[#030010] overflow-hidden">
        {/* Subtle placeholder to prevent layout shifts */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#02050A] to-transparent pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 w-full h-full bg-[#030010] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <CameraController zooming={zooming} introPlaying={introPlaying} />
        <fog attach="fog" args={['#030010', 2, 20]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#22d3ee" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#c084fc" />
        <pointLight position={[0, 0, 0]} intensity={4} color="#06b6d4" />
        
        <Stars radius={100} depth={50} count={8000} factor={6} saturation={1} fade speed={2} />
        <TransactionStreams />
        
        <EncryptedGlobe />
        <FloatingAvatars />
      </Canvas>
      {/* Vitiating gradients to blend edges with content below */}
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#02050A] to-transparent pointer-events-none"></div>
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#02050A]/80 to-transparent pointer-events-none"></div>
    </div>
  );
}
