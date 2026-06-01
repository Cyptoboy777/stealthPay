# StealthPay — Privacy-First Payroll & Treasury on Fhenix

![StealthPay Banner](https://via.placeholder.com/1200x400/0a0a0a/00ff9f?text=STEALTHPAY+-+Encrypted+Payroll+on+Fhenix)

**The most futuristic, fully encrypted payroll & treasury platform built on Fhenix + Privara.**

Privacy is not a feature. It’s the entire experience.

---

## ✨ Vision

Most payroll tools expose sensitive salary data on-chain.  
**StealthPay** changes that.

Using **Fhenix’s Fully Homomorphic Encryption (FHE)** and **Privara’s confidential payment rails**, we built a production-ready payroll system where **everything stays encrypted** during computation — salaries, bonuses, budgets, and compliance data.

Perfect for DAOs, web3 startups, freelancers, and enterprises who need real privacy + compliance.

---

## 🎥 Live Demo & Walkthrough

- **Landing Experience** → Immersive 3D cyberpunk walkthrough
- **Dashboard** → Full interactive 3D holographic interface
- **Live Vercel Deployment:** [https://stealthpay-wave5.vercel.app](https://stealthpay-wave5.vercel.app) *(Replace with actual Vercel domain)*
- **Demo Video:** [Watch Here](https://youtu.be/your-demo-video) *(Upload video and replace link)*

---

## 🔥 Key Features

### 1. Immersive 3D Cyberpunk Experience
- Smooth 3D landing page with camera fly-through
- Animated encrypted particle salary streams
- Glassmorphic holographic UI with neon accents

### 2. Real-time Streaming Payroll
- Visual salary streams flowing from company vault to stealth addresses
- Live number animations + particle effects

### 3. Gemini AI Payroll Assistant
- Holographic AI chat companion
- Ask anything about salary, budget, privacy, or compliance
- Powered by Gemini + encrypted context

### 4. Stealth Splitter (Privara Powered)
- Interactive slider to auto-split salary (80% Main | 10% Savings | 10% Yield)
- Programmable private transfers using Privara SDK

### 5. Smart Encrypted Conditions
- Performance-based bonuses
- Budget checks
- Tax withholding — all computed on encrypted data using FHE

### 6. Compliance & Selective Disclosure
- One-click auditor proofs (totals without revealing individuals)

### 7. Privacy-First UX
- Permanent Stealth Addresses
- Passkey authentication + multiple recovery (Steganographic PNG, Encrypted ZIP)
- Gasless claims (ERC-4337)

---

## 🛠️ Tech Stack

| Layer              | Technology |
|--------------------|----------|
| Blockchain         | Fhenix (Sepolia / Arbitrum / Base) + CoFHE |
| Confidential Payments | Privara SDK |
| Smart Contracts    | Solidity + FHE Library (`euint`, `FHE.select`, etc.) |
| Frontend           | Next.js 15 + Tailwind + Glassmorphism |
| 3D & Animations    | React Three Fiber + Drei + GSAP + Framer Motion |
| AI                 | Gemini 1.5 Flash |
| Wallet & Gasless   | ERC-4337 Account Abstraction + Passkeys |
| Development        | Hardhat + Cofhe Plugin |

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/stealthpay.git
cd stealthpay

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Smart Contract Development

```bash
cd contracts
npx hardhat test
npx hardhat run scripts/deploy.ts --network fhenix_testnet
```

## 📁 Project Structure

```text
stealthpay/
├── contracts/              # FHE Smart Contracts
├── frontend/               # Next.js + 3D Dashboard
├── scripts/                # Deployment scripts
├── tests/                  # FHE + integration tests
├── components/
│   ├── 3D/                 # React Three Fiber scenes
│   ├── AI-Chat/
│   └── Dashboard/
├── public/                 # Assets & models
└── README.md
```

## 🏆 Built For Fhenix Privacy-by-Design Buildathon

- **Wave 1-3:** Core privacy features (Stealth Addresses, Passkey, Encrypted Balances, Gasless)
- **Wave 4:** Smart Conditions + Compliance Proofs
- **Wave 5:** Full 3D Experience + AI + Streaming Visuals + Polish

*This is not a demo — it’s a production-ready foundation for confidential payroll infrastructure.*

## 📚 Documentation & Resources

- Fhenix Docs → [cofhe-docs.fhenix.zone](https://cofhe-docs.fhenix.zone)
- Privara Docs → [reineira.xyz/docs](https://reineira.xyz/docs)
- CoFHE SDK → `@cofhe/sdk` & `@cofhe/react`
