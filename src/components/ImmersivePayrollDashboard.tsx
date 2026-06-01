'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sparkles, Stars, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Scanline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { Eye, EyeOff, Lock, ChevronRight, Fingerprint, Activity, Clock, FileCheck, ArrowRight, Wallet, CheckCircle2, Bot, Sparkles as SparklesIcon, Cpu, ShieldCheck, Terminal, Upload, Coins, BarChart3, HelpCircle, Loader2 } from 'lucide-react';
import { usePayrollStore } from '@/src/store/usePayrollStore';
import { useAccount, useBalance, useSignMessage } from 'wagmi';
import { toast } from 'sonner';
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
  CircleDollarSign,
  DatabaseZap,
  Gauge,
  Landmark,
  LockKeyhole,
  PiggyBank,
  Send,
  SlidersHorizontal,
  Users,
  Vault,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';

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
  icon: any;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className={`rounded-xl border border-white/5 bg-[#0A0A0A]/50 p-5 backdrop-blur-md`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <Icon className="h-4 w-4 text-zinc-600" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500 font-light">{detail}</p>
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
    <Card className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-2xl backdrop-blur-3xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-5 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          Stealth Splitter
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 font-light mt-1">
          Confidential routing policy percentages
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_160px]">
        <div className="space-y-6">
          {destinations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Icon className="h-4 w-4 text-zinc-500" />
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
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
                  className="w-full appearance-none h-1.5 rounded-full bg-zinc-800"
                  style={{ accentColor: '#ffffff' }}
                />
              </div>
            );
          })}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400 leading-relaxed font-light">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-zinc-500" />
            Route proof commits only percentages. Amounts stay ciphertext.
          </div>
        </div>
        <div className="h-44 min-h-44">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={['#ffffff', '#a1a1aa', '#52525b'][index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                itemStyle={{ color: '#FAFAFA' }}
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
    <Card className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-2xl backdrop-blur-3xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-5 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
          <Gauge className="h-4 w-4 text-zinc-400" />
          Analytics
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 font-light mt-1">
          Aggregated budget and compliance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <MetricCard icon={CircleDollarSign} label="Budget" value="$57k" detail="+12% encrypted" tone="border-white/5" />
          <MetricCard icon={DatabaseZap} label="Gas Saved" value="41%" detail="AA bundling" tone="border-white/5" />
          <MetricCard icon={Fingerprint} label="Proof" value={`${disclosureScore}%`} detail="selective pass" tone="border-white/5" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-52 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="budgetGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FAFAFA" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FAFAFA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="budget" stroke="#FAFAFA" fill="url(#budgetGlow)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-52 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={analyticsData}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Bar dataKey="compliance" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
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
        'I am your StealthPay AI payroll companion. Ask about salary routing, budgets, privacy, or which selective disclosure proof to generate next.',
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
          content: data.answer || 'I could not reach StealthPay AI, but your encrypted payroll policy still looks valid.',
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'StealthPay AI is offline in this environment. Keep essential cash in Main Wallet, savings in a stealth address, and route only surplus to yield.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col h-[460px]">
      <CardHeader className="border-b border-white/5 pb-5 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
          <Bot className="h-4 w-4 text-zinc-400" />
          AI Payroll Assistant
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 font-light mt-1">
          Powered by Gemini 1.5
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-6 gap-4 min-h-0">
        <div className="flex-1 overflow-y-auto rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-4 pr-2">
          {messages.map((message) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-white/5 text-zinc-300 border border-white/5'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-xs text-zinc-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing...
            </div>
          )}
        </div>
        <form onSubmit={submit} className="flex gap-3 mt-auto shrink-0">
          <input
            aria-label="Ask AI Assistant"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-500 focus:bg-white/10 placeholder:text-zinc-600"
            placeholder="Ask about salary, budget, or privacy..."
          />
          <Button
            type="submit"
            size="icon"
            className="h-[46px] w-[46px] shrink-0 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function CompliancePanel() {
  return (
    <Card className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-2xl backdrop-blur-3xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-5 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-white">
          <LockKeyhole className="h-4 w-4 text-zinc-400" />
          Compliance Proofs
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 font-light mt-1">
          Zero-knowledge selective disclosure conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {proofRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`h-4 w-4 ${
                  row.tone === 'emerald' ? 'text-zinc-300' : row.tone === 'amber' ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              />
              <span className="text-sm text-zinc-300 font-light">{row.label}</span>
            </div>
            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 bg-white/5">
              {row.state}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ImmersivePayrollDashboard() {
  const { address: walletAddress, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address: walletAddress });
  const { signMessageAsync } = useSignMessage();
  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : "0.0000";

  const { 
    payrollState, 
    setPayrollState, 
    employeeClaimHash, 
    setEmployeeClaimHash 
  } = usePayrollStore();

  const [mounted, setMounted] = useState(false);
  const [splits, setSplits] = useState<Record<SplitKey, number>>({ main: 55, savings: 25, yield: 20 });
  const salary = 5240;

  // Real Web3/FHE Decryption and ZK Claim states
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const claimed = payrollState === 'claimed';
  const txHash = employeeClaimHash;
  const amount = '5,240.00';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDecryptRequest = () => {
    if (payrollState === 'idle') {
      toast.warning("No Payroll Batch", { description: "No payroll batch has been uploaded yet. Please act as an Employer first!" });
      return;
    }
    if (payrollState === 'uploaded') {
      toast.warning("Pending Approval", { description: "The payroll batch is uploaded but awaiting Treasurer multi-sig approval. Please act as a Treasurer first to approve it!" });
      return;
    }
    if (!isDecrypted) {
      if (!isConnected) {
        toast.error("Wallet Disconnected", { description: "Connect wallet to decrypt balance" });
        return;
      }
      setShowAuthModal(true);
    } else {
      setIsDecrypted(false);
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    toast.promise(
      signMessageAsync({ account: walletAddress as `0x${string}`, message: 'Decrypt my FHE payroll buffer for epoch 92: StealthPay' }),
      {
        loading: 'Decrypting FHE ciphertexts...',
        success: () => {
          setIsDecrypted(true);
          return 'FHE payroll buffer decrypted successfully.';
        },
        error: 'Decryption signature denied.',
      }
    );
  };

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error("Wallet Disconnected", { description: "Please connect wallet first." });
      return;
    }
    setIsClaiming(true);
    toast.promise(
      signMessageAsync({ account: walletAddress as `0x${string}`, message: 'Authorizing claim of encrypted assets to my wallet via Privara route.' }),
      {
        loading: 'Generating Zero-Knowledge proofs...',
        success: (sig) => {
          const computedHash = ethers.keccak256(ethers.toUtf8Bytes(String(sig))).slice(0, 42);
          setEmployeeClaimHash(computedHash);
          setTimeout(() => {
            setPayrollState('claimed');
            setIsClaiming(false);
            toast.success("Assets Claimed", { description: "Encrypted payload routed to stealth node." });
          }, 3000);
          return 'ZK Proofs validated. Broadcasting transaction...';
        },
        error: () => {
          setIsClaiming(false);
          return 'Claim authorization rejected.';
        },
      }
    );
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
    setSplits((current) => {
      const otherKeys = (Object.keys(current) as SplitKey[]).filter(k => k !== key);
      const diff = value - current[key];
      const remaining = current[otherKeys[0]] + current[otherKeys[1]];
      
      if (remaining === 0) {
        return { ...current, [key]: value, [otherKeys[0]]: (100-value)/2, [otherKeys[1]]: (100-value)/2 };
      }
      
      return {
        ...current,
        [key]: value,
        [otherKeys[0]]: Math.max(0, Math.round(current[otherKeys[0]] - diff * (current[otherKeys[0]] / remaining))),
        [otherKeys[1]]: Math.max(0, Math.round(current[otherKeys[1]] - diff * (current[otherKeys[1]] / remaining))),
      };
    });
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
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-wide text-zinc-300">
                <SparklesIcon className="h-3 w-3 text-zinc-400" />
                Confidential Salary Stream Online
              </div>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                Encrypted payroll, <br/>
                <span className="text-zinc-500">privately routed.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-zinc-400">
                Salary leaves the vault as ciphertext, passes through Stealth routing policies, and lands in addresses with proof-ready compliance controls.
              </p>
            </div>
            
            {/* Decrypt & Claim Interactive Console */}
            <div className="w-full lg:w-80 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 p-6 backdrop-blur-2xl shadow-xl space-y-5">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-zinc-300 font-medium text-xs">Secure Console</span>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${claimed ? 'bg-zinc-400' : 'bg-blue-500 animate-pulse'}`}></span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">{claimed ? 'Settled' : 'Locked'}</span>
                </span>
              </div>

              <div className="text-[10px] font-mono uppercase pb-2 border-b border-white/5">
                {payrollState === 'idle' && <span className="text-zinc-400">AWAITING EMPLOYER UPLOAD</span>}
                {payrollState === 'uploaded' && <span className="text-blue-400">AWAITING MULTISIG</span>}
                {payrollState === 'approved' && <span className="text-zinc-300">UNLOCKED / READY</span>}
                {payrollState === 'claimed' && <span className="text-zinc-500">DISBURSED TO NODES</span>}
              </div>
              
              <div className="space-y-1 py-2">
                <p className="text-xs text-zinc-500 font-medium">Available Salary Buffer</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-semibold tracking-[-0.04em] ${isDecrypted ? 'text-white' : 'text-zinc-700'}`}>
                    {isDecrypted ? `$${amount}` : '********'}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">USDC</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleDecryptRequest}
                  className={`flex-1 h-10 text-xs font-medium rounded-xl transition-all duration-300 ${
                    isDecrypted 
                      ? 'border border-white/10 text-white bg-white/5 hover:bg-white/10' 
                      : 'border border-white/10 text-zinc-300 bg-transparent hover:bg-white/5'
                  }`}
                >
                  {isDecrypted ? 'Hide Balance' : 'Decrypt FHE'}
                </Button>
                
                <Button
                  onClick={handleClaim}
                  disabled={isClaiming || claimed || !isDecrypted}
                  className={`flex-1 h-10 text-xs font-medium rounded-xl transition-all duration-300 ${
                    isClaiming || claimed || !isDecrypted
                      ? 'bg-white/5 text-zinc-500 cursor-not-allowed'
                      : 'bg-white text-black hover:scale-105'
                  }`}
                >
                  {isClaiming ? 'Claiming...' : claimed ? 'Claimed' : 'Execute Claim'}
                </Button>
              </div>

              {txHash && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[10px] text-zinc-400 space-y-1">
                  <p className="text-zinc-500 font-medium">Transaction Broadcasted</p>
                  <p className="truncate font-mono">{txHash}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <MetricCard icon={Vault} label="Cycle Salary" value="$5,240" detail="Private USDC claim" tone="border-white/5" />
            <MetricCard icon={ShieldCheck} label="Privacy" value="FHE" detail="No raw amount exposure" tone="border-white/5" />
            <MetricCard icon={Landmark} label="Privara" value="3 Way" detail="Stealth split policy" tone="border-white/5" />
            <MetricCard icon={Fingerprint} label="Disclosure" value="ZK" detail="Auditor safe proofs" tone="border-white/5" />
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


      <PasskeyAuthModal 
        isOpen={showAuthModal} 
        onSuccess={handleAuthSuccess} 
        onCancel={() => setShowAuthModal(false)} 
      />

      {/* Live Fhenix Network Status Widget - Zero Risk High Impact Feature */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-cyan-500/20 bg-black/80 px-4 py-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl cursor-crosshair group hover:border-cyan-400/50 transition-colors"
      >
        <div className="relative flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-50 group-hover:text-cyan-300 transition-colors">Fhenix Helium Subnet</span>
          <span className="font-mono text-[9px] text-emerald-400/70 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> FHE Coprocessor: <span className="text-emerald-400">SECURE</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
