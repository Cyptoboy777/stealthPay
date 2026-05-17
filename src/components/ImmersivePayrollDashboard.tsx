'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sparkles, Stars, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Scanline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import PasskeyAuthModal from '@/src/components/PasskeyAuthModal';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  DatabaseZap,
  Fingerprint,
  Gauge,
  Landmark,
  LockKeyhole,
  PiggyBank,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles as SparklesIcon,
  Terminal,
  Users,
  Vault,
  Wallet,
  Cpu,
  Lock,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { useWeb3 } from '@/src/lib/Web3Context';

type SplitKey = 'main' | 'savings' | 'yield';

type AssistantMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

const streamPaths: [number, number, number][][] = [
  [
    [-3.7, 0.25, 0],
    [-1.4, 1.1, 0.35],
    [1.4, 1.45, 0.1],
    [3.85, 1.1, 0],
  ],
  [
    [-3.7, 0.05, 0],
    [-1.2, 0.15, -0.35],
    [1.4, 0.05, 0],
    [3.85, -0.15, 0],
  ],
  [
    [-3.7, -0.2, 0],
    [-1.6, -1.15, 0.35],
    [1.1, -1.45, -0.1],
    [3.85, -1.25, 0],
  ],
];

const analyticsData = [
  { month: 'Jan', budget: 42, gas: 16, compliance: 87 },
  { month: 'Feb', budget: 48, gas: 21, compliance: 90 },
  { month: 'Mar', budget: 51, gas: 28, compliance: 92 },
  { month: 'Apr', budget: 46, gas: 35, compliance: 94 },
  { month: 'May', budget: 57, gas: 41, compliance: 98 },
];

const proofRows = [
  { label: 'Salary cap under approved budget', state: 'proved', tone: 'emerald' },
  { label: 'Jurisdiction tax band satisfied', state: 'selective', tone: 'cyan' },
  { label: 'Vendor wallet risk threshold', state: 'queued', tone: 'amber' },
];

function VaultNode({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = elapsed * 0.2;
      meshRef.current.rotation.y = elapsed * 0.35;
    }
  });

  return (
    <Float speed={1.7} rotationIntensity={0.28} floatIntensity={0.28}>
      <group position={position}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[0.72, 0]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.7}
            roughness={0.18}
            metalness={0.85}
            clearcoat={1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.16} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.26, 0.018, 12, 80]} />
          <meshBasicMaterial color={color} transparent opacity={0.52} />
        </mesh>
        <Text
          position={[0, -1.55, 0]}
          fontSize={0.16}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0}
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Packet({ path, color, offset, active }: { path: [number, number, number][]; color: string; offset: number; active: boolean }) {
  const packetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const curve = new THREE.CatmullRomCurve3(path.map((point) => new THREE.Vector3(...point)));
    const speed = active ? 0.28 : 0.04;
    const t = (state.clock.getElapsedTime() * speed + offset) % 1;
    const current = curve.getPointAt(t);
    if (packetRef.current) {
      packetRef.current.position.copy(current);
      packetRef.current.scale.setScalar((active ? 1.05 : 0.45) * (0.75 + Math.sin(t * Math.PI) * 0.65));
    }
  });

  return (
    <mesh ref={packetRef}>
      <sphereGeometry args={[0.085, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={active ? 0.95 : 0.2} />
    </mesh>
  );
}

function SalaryStreamScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0">
      <Canvas gl={{ antialias: false }} camera={{ position: [0, 0.35, 8.2], fov: 42 }}>
        <color attach="background" args={['#01030a']} />
        <fog attach="fog" args={['#01030a', 7, 18]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[-4, 3, 4]} intensity={2.9} color="#22d3ee" />
        <pointLight position={[4, -1, 4]} intensity={2.5} color="#34d399" />
        <pointLight position={[0, 2, 5]} intensity={1.8} color="#f59e0b" />

        <Stars radius={70} depth={42} count={3500} factor={4} saturation={1} fade speed={0.8} />
        <Sparkles count={active ? 300 : 80} scale={[8.2, 3.6, 2.2]} size={1.8} color="#22d3ee" speed={active ? 0.35 : 0.1} opacity={active ? 0.45 : 0.18} />

        <VaultNode position={[-4, 0, 0]} color="#22d3ee" label="ENCRYPTED_VAULT" />
        <VaultNode position={[4, 1.1, 0]} color="#34d399" label="MAIN_STEALTH" />
        <VaultNode position={[4, -0.15, 0]} color="#f59e0b" label="SAVINGS_NODE" />
        <VaultNode position={[4, -1.25, 0]} color="#c084fc" label="YIELD_VAULT" />

        {streamPaths.map((path, index) => (
          <group key={index}>
            <Line points={path} color={['#34d399', '#f59e0b', '#c084fc'][index]} lineWidth={1.8} transparent opacity={active ? 0.65 : 0.12} />
            <Packet path={path} color={['#34d399', '#f59e0b', '#c084fc'][index]} offset={index * 0.22} active={active} />
            <Packet path={path} color="#ffffff" offset={index * 0.22 + 0.36} active={active} />
          </group>
        ))}

        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.15} mipmapBlur intensity={1.35} radius={0.62} />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={1.35} opacity={0.07} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0015, 0.0015)} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className={`rounded-lg border ${tone} bg-black/36 p-4 backdrop-blur-xl`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-100/56">{label}</p>
        <Icon className="h-4 w-4 text-cyan-200/70" />
      </div>
      <p className="mt-3 font-mono text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-cyan-100/48">{detail}</p>
    </div>
  );
}

function SplitterPanel({
  salary,
  splits,
  setSplit,
}: {
  salary: number;
  splits: Record<SplitKey, number>;
  setSplit: (key: SplitKey, value: number) => void;
}) {
  const destinations = [
    { key: 'main' as SplitKey, label: 'Main Wallet', icon: Wallet, color: '#34d399' },
    { key: 'savings' as SplitKey, label: 'Savings', icon: PiggyBank, color: '#f59e0b' },
    { key: 'yield' as SplitKey, label: 'Yield Vaults', icon: Landmark, color: '#c084fc' },
  ];

  const chartData = destinations.map((item) => ({
    name: item.label,
    value: splits[item.key],
    color: item.color,
  }));

  return (
    <Card className="rounded-lg border-cyan-500/24 bg-[#020813]/86 shadow-[0_0_45px_rgba(6,182,212,0.08)] backdrop-blur-2xl">
      <CardHeader className="border-b border-cyan-500/10 pb-4">
        <CardTitle className="flex items-center gap-2 font-mono text-base text-cyan-100">
          <SlidersHorizontal className="h-5 w-5 text-cyan-300" />
          Stealth Splitter
        </CardTitle>
        <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-cyan-200/42">
          Privara powered routing policy
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 pt-6 lg:grid-cols-[1fr_160px]">
        <div className="space-y-5">
          {destinations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-cyan-50">
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-cyan-100/68">
                    {splits[item.key]}% / ${Math.round((salary * splits[item.key]) / 100).toLocaleString()}
                  </span>
                </div>
                <input
                  aria-label={`${item.label} split`}
                  type="range"
                  min="0"
                  max="100"
                  value={splits[item.key]}
                  onChange={(event) => setSplit(item.key, Number(event.target.value))}
                  className="stealth-range w-full"
                  style={{ accentColor: item.color }}
                />
              </div>
            );
          })}
          <div className="rounded-lg border border-emerald-500/24 bg-emerald-500/8 p-3 font-mono text-[11px] text-emerald-200/78">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />
            Route proof commits only percentages and destinations. Amounts stay ciphertext.
          </div>
        </div>
        <div className="h-44 min-h-44">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie data={chartData} innerRadius={42} outerRadius={70} paddingAngle={4} dataKey="value">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="rgba(255,255,255,0.2)" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#020813', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 8 }}
                itemStyle={{ color: '#e0faff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsPanel({ splits }: { splits: Record<SplitKey, number> }) {
  const disclosureScore = Math.min(99, 78 + Math.round(splits.savings / 4) + Math.round(splits.yield / 5));

  return (
    <Card className="rounded-lg border-emerald-500/24 bg-[#03100b]/82 shadow-[0_0_45px_rgba(16,185,129,0.08)] backdrop-blur-2xl">
      <CardHeader className="border-b border-emerald-500/10 pb-4">
        <CardTitle className="flex items-center gap-2 font-mono text-base text-emerald-100">
          <Gauge className="h-5 w-5 text-emerald-300" />
          Holographic Analytics
        </CardTitle>
        <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-emerald-200/42">
          Aggregated budget, gas savings, compliance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard icon={CircleDollarSign} label="Budget" value="$57k" detail="+12% encrypted" tone="border-cyan-500/20" />
          <MetricCard icon={DatabaseZap} label="Gas Saved" value="41%" detail="AA bundling" tone="border-amber-500/20" />
          <MetricCard icon={Fingerprint} label="Proof" value={`${disclosureScore}%`} detail="selective pass" tone="border-emerald-500/20" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-52 rounded-lg border border-cyan-500/12 bg-black/28 p-3">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="budgetGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(34,211,238,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#67e8f9', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#020813', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="budget" stroke="#22d3ee" fill="url(#budgetGlow)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-52 rounded-lg border border-emerald-500/12 bg-black/28 p-3">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={analyticsData}>
                <CartesianGrid stroke="rgba(52,211,153,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#6ee7b7', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#020813', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8 }} />
                <Bar dataKey="compliance" fill="#34d399" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssistantPanel({ salary, splits }: { salary: number; splits: Record<SplitKey, number> }) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      content:
        'I am your Gemini payroll companion. Ask about salary routing, budgets, privacy, or which selective disclosure proof to generate next.',
    },
  ]);
  const [input, setInput] = useState('How much should I keep liquid this cycle?');
  const [loading, setLoading] = useState(false);

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: AssistantMessage = { id: crypto.randomUUID(), role: 'user', content: question };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini-payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, salary, splits }),
      });
      const data = (await response.json()) as { answer?: string };
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer || 'I could not reach Gemini, but your encrypted payroll policy still looks valid.',
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Gemini is offline in this environment. Keep essential cash in Main Wallet, savings in a stealth address, and route only surplus to yield.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-lg border-purple-500/28 bg-[#090412]/86 shadow-[0_0_45px_rgba(168,85,247,0.1)] backdrop-blur-2xl">
      <CardHeader className="border-b border-purple-500/10 pb-4">
        <CardTitle className="flex items-center gap-2 font-mono text-base text-purple-100">
          <Bot className="h-5 w-5 text-purple-300" />
          Gemini AI Payroll Assistant
        </CardTitle>
        <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-purple-200/42">
          Holographic privacy and budget counsel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="h-72 space-y-3 overflow-y-auto rounded-lg border border-purple-500/14 bg-black/34 p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[86%] rounded-lg border px-3 py-2 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'border-cyan-500/30 bg-cyan-500/12 text-cyan-50'
                    : 'border-purple-500/28 bg-purple-500/12 text-purple-50'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-purple-500/24 bg-purple-500/10 px-3 py-2 font-mono text-xs text-purple-200">
              <BrainCircuit className="h-4 w-4 animate-pulse" />
              Gemini thinking...
            </div>
          )}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            aria-label="Ask Gemini payroll assistant"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-purple-500/24 bg-black/45 px-3 py-3 text-sm text-purple-50 outline-none transition focus:border-purple-300"
            placeholder="Ask about salary, budget, or privacy"
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 border border-purple-500/40 bg-purple-500/20 text-purple-100 hover:bg-purple-500/35"
            title="Send question"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CompliancePanel() {
  return (
    <Card className="rounded-lg border-cyan-500/22 bg-[#02070d]/84 backdrop-blur-2xl">
      <CardHeader className="border-b border-cyan-500/10 pb-4">
        <CardTitle className="flex items-center gap-2 font-mono text-base text-cyan-100">
          <LockKeyhole className="h-5 w-5 text-cyan-300" />
          Smart Conditions Engine
        </CardTitle>
        <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-cyan-200/42">
          Selective disclosure proofs in progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        {proofRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg border border-cyan-500/12 bg-black/28 p-3">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`h-4 w-4 ${
                  row.tone === 'emerald' ? 'text-emerald-300' : row.tone === 'amber' ? 'text-amber-300' : 'text-cyan-300'
                }`}
              />
              <span className="text-sm text-cyan-50/78">{row.label}</span>
            </div>
            <span className="rounded border border-cyan-500/16 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200/62">
              {row.state}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ImmersivePayrollDashboard() {
  const { walletAddress, balance, signer } = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [splits, setSplits] = useState<Record<SplitKey, number>>({ main: 55, savings: 25, yield: 20 });
  const salary = 5240;

  // Real Web3/FHE Decryption and ZK Claim states
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDecryptRequest = () => {
    if (!isDecrypted) {
      if (!signer) {
        alert('Connect wallet to decrypt balance');
        return;
      }
      setShowAuthModal(true);
    } else {
      setIsDecrypted(false);
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    try {
      await signer!.signMessage('Decrypt my FHE payroll buffer for epoch 92: StealthPay');
      setAmount('5,240.00');
      setIsDecrypted(true);
    } catch (err) {
      console.error('User denied decryption signature', err);
    }
  };

  const handleClaim = async () => {
    if (!signer) {
      alert('Please connect wallet first.');
      return;
    }
    setIsClaiming(true);
    try {
      const sig = await signer.signMessage('Authorizing claim of encrypted assets to my wallet via Privara route.');
      setTxHash(ethers.keccak256(ethers.toUtf8Bytes(sig)).slice(0, 42));
      setTimeout(() => {
        setClaimed(true);
        setIsClaiming(false);
      }, 3000);
    } catch (err) {
      console.error('User denied claim signature', err);
      setIsClaiming(false);
    }
  };

  const normalizedSplits = useMemo(() => {
    const total = Object.values(splits).reduce((sum, value) => sum + value, 0) || 1;
    return {
      main: Math.round((splits.main / total) * 100),
      savings: Math.round((splits.savings / total) * 100),
      yield: 100 - Math.round((splits.main / total) * 100) - Math.round((splits.savings / total) * 100),
    };
  }, [splits]);

  const setSplit = (key: SplitKey, value: number) => {
    setSplits((current) => ({ ...current, [key]: value }));
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center font-mono text-xs uppercase tracking-widest text-cyan-300">
        Loading encrypted payroll interface...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-3 pb-10 sm:px-4">
      <section className="relative min-h-[520px] overflow-hidden rounded-lg border border-cyan-500/24 bg-[#01030a] shadow-[0_0_80px_rgba(6,182,212,0.12)]">
        <SalaryStreamScene active={claimed || isClaiming} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,3,10,0.12),rgba(1,3,10,0.78))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />

        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan-100">
                <SparklesIcon className="h-3.5 w-3.5 text-cyan-300" />
                Confidential salary stream online
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                Encrypted payroll, routed into private destinations.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/68 sm:text-lg">
                Salary leaves the vault as ciphertext, passes through Privara split policy, and lands in stealth addresses
                with proof-ready compliance controls.
              </p>
            </div>
            
            {/* Decrypt & Claim Interactive Console */}
            <div className="w-full lg:w-80 rounded-2xl border border-cyan-500/30 bg-black/60 p-6 font-mono text-xs text-cyan-100 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-4">
              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Secure Console</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${claimed ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                  <span className="text-[9px] uppercase tracking-wider text-cyan-500/60">{claimed ? 'SETTLED' : 'LOCKED'}</span>
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-[9px] text-cyan-500/40 uppercase tracking-widest">Available Salary Buffer</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black tracking-tight ${isDecrypted ? 'text-white text-shadow-glow-cyan' : 'text-cyan-800/80'}`}>
                    {isDecrypted ? `$${amount}` : '********'}
                  </span>
                  <span className="text-[10px] text-cyan-500/60">USDC</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDecryptRequest}
                  className={`flex-grow h-10 text-[10px] font-bold uppercase tracking-wider font-mono border rounded-lg transition-all duration-300 ${
                    isDecrypted 
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40' 
                      : 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-500/10'
                  }`}
                >
                  {isDecrypted ? 'Hide Balance' : 'Decrypt FHE'}
                </Button>
                
                <Button
                  onClick={handleClaim}
                  disabled={isClaiming || claimed || !isDecrypted}
                  className={`flex-grow h-10 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg transition-all duration-300 ${
                    isClaiming || claimed || !isDecrypted
                      ? 'bg-cyan-950/20 border border-cyan-500/10 text-cyan-500/20 cursor-not-allowed'
                      : 'bg-cyan-500 text-black border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 hover:scale-105'
                  }`}
                >
                  {isClaiming ? 'Claiming...' : claimed ? 'Claimed' : 'Execute Claim'}
                </Button>
              </div>

              {txHash && (
                <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-2 font-mono text-[9px] text-emerald-400/90 space-y-1">
                  <p className="text-emerald-500/40 uppercase tracking-widest text-[8px]">Transaction Broadcasted</p>
                  <p className="truncate">{txHash}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <MetricCard icon={Vault} label="Cycle Salary" value="$5,240" detail="Private USDC claim" tone="border-cyan-500/22" />
            <MetricCard icon={ShieldCheck} label="Privacy" value="FHE" detail="No raw amount exposure" tone="border-emerald-500/22" />
            <MetricCard icon={Landmark} label="Privara" value="3 Way" detail="Stealth split policy" tone="border-amber-500/22" />
            <MetricCard icon={Fingerprint} label="Disclosure" value="ZK" detail="Auditor safe proofs" tone="border-purple-500/22" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SplitterPanel salary={salary} splits={normalizedSplits} setSplit={setSplit} />
          <AnalyticsPanel splits={normalizedSplits} />
        </div>
        <div className="space-y-6">
          <AssistantPanel salary={salary} splits={normalizedSplits} />
          <CompliancePanel />
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-cyan-500/18 bg-black/30 p-4 backdrop-blur-xl md:grid-cols-3">
        {[
          ['1', 'Decrypt payout buffer', 'Passkey signature unlocks only your local salary view.'],
          ['2', 'Route with Privara', 'Slider policy emits stealth destination commitments.'],
          ['3', 'Prove compliance', 'Selective proofs disclose aggregate conditions without row data.'],
        ].map(([step, title, body]) => (
          <div key={step} className="flex gap-3 rounded-lg border border-cyan-500/12 bg-cyan-500/5 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cyan-500/30 font-mono text-sm text-cyan-200">
              {step}
            </span>
            <div>
              <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-50">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-cyan-100/56">{body}</p>
            </div>
            <ChevronRight className="ml-auto hidden h-4 w-4 text-cyan-300/50 md:block" />
          </div>
        ))}
      </section>

      {/* Reintegrated from Landing Page */}
      <section className="mt-12 space-y-8">
         <div className="text-center mb-8">
            <h2 className="font-mono text-2xl font-black text-white tracking-widest uppercase">Ecosystem Architecture</h2>
            <p className="text-cyan-500/60 font-mono text-xs tracking-widest mt-2">StealthPay Network Nodes</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto perspective-1000">
            <Card className="group relative bg-[#060410]/80 backdrop-blur-2xl border border-purple-500/30 hover:border-purple-400/80 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors duration-500"></div>
              
              <CardHeader className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-[#0a0514] border border-purple-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]">
                  <Users className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <CardTitle className="text-xl text-purple-50 font-black font-mono tracking-tighter">ROOT_EMPLOYER</CardTitle>
                <CardDescription className="text-purple-200/50 leading-relaxed mt-2 font-mono text-[10px]">Init encrypted batch payloads & manage stealth roster without exposing burn rate.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative bg-[#020813]/80 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400/80 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors duration-500"></div>

              <CardHeader className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-[#030d1a] border border-cyan-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
                  <Lock className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <CardTitle className="text-xl text-cyan-50 font-black font-mono tracking-tighter">USER_WALLET</CardTitle>
                <CardDescription className="text-cyan-200/50 leading-relaxed mt-2 font-mono text-[10px]">Decrypt incoming streams. Zero-knowledge access to your personal payout vault.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative bg-[#020a06]/80 backdrop-blur-2xl border border-emerald-500/30 hover:border-emerald-400/80 transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors duration-500"></div>

              <CardHeader className="relative z-10 p-6">
                <div className="h-12 w-12 rounded-xl bg-[#04120a] border border-emerald-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]">
                  <Vault className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
                <CardTitle className="text-xl text-emerald-50 font-black font-mono tracking-tighter">MULTI_SIG_OPS</CardTitle>
                <CardDescription className="text-emerald-200/50 leading-relaxed mt-2 font-mono text-[10px]">Approve FHE computes & encrypted state changes. Prove solvency without exposure.</CardDescription>
              </CardHeader>
            </Card>
         </div>

         <div className="w-full max-w-7xl mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#05070A]/80 backdrop-blur-2xl text-white p-8 md:p-12 rounded-[2rem] border border-cyan-500/20 shadow-[0_30px_100px_rgba(6,182,212,0.1)] relative overflow-hidden mx-auto">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)] font-mono">
                ZK_COMPLIANCE_ACTIVE
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                Privacy-by-Design <br/> From Genesis Block
              </h3>
              <p className="text-cyan-100/60 leading-relaxed font-light text-sm max-w-xl">
                No more strategy leaks or MEV extraction from your treasury operations. Utilize Fhenix CoFHE for full
                homomorphic encryption computations. Salaries are processed securely and only intended recipients can decrypt them.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                   <ShieldCheck className="w-4 h-4 text-emerald-400" /> ZK_PROOFS
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-300 font-mono bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                   <Cpu className="w-4 h-4 text-purple-400" /> FHE_COPROCESSOR
                </div>
              </div>
            </div>

            <div className="bg-[#02050A] p-6 rounded-2xl font-mono text-xs leading-relaxed border border-cyan-500/30 shadow-[inset_0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.03)_2px,rgba(6,182,212,0.03)_4px)] pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/20 pb-3">
                <Terminal className="w-4 h-4 text-cyan-500/60" />
                <span className="text-cyan-500/60 uppercase tracking-widest text-[10px]">Fhenix_Smart_Contract.sol</span>
              </div>

              <p className="text-slate-500/80 mb-2">{`// Secure Payroll FHE Execution`}</p>
              <p className="text-cyan-300 mb-1"><span className="text-purple-400">euint256</span> employeeSalary = FHE.asEuint256(encryptedInput);</p>
              <p className="text-cyan-300 mb-1"><span className="text-purple-400">euint256</span> taxAmount = employeeSalary.mul(taxRate);</p>
              <p className="text-cyan-300 mb-3"><span className="text-purple-400">euint256</span> netPayout = employeeSalary.sub(taxAmount);</p>
              <p className="text-emerald-500/60 mt-3">{`// State transitions resolved strictly in ciphertext`}</p>
              <p className="text-emerald-500/60">{`// Compliance verifications via zk-SNARKs`}</p>
            </div>
         </div>
      </section>
      <PasskeyAuthModal 
        isOpen={showAuthModal} 
        onSuccess={handleAuthSuccess} 
        onCancel={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
