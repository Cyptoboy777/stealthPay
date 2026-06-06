<div align="center">
  <img src="public/logo.png" alt="StealthPay Logo" height="120" />
  <h1>StealthPay</h1>
  <p><strong>Confidential Enterprise Payroll & Treasury Infrastructure. Powered by Fhenix & CoFHE.</strong></p>

  <p>
    <a href="https://stealth-pay-iota.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live_App-Ready-success?style=for-the-badge&logo=vercel" alt="Live App" />
    </a>
    <a href="https://youtu.be/mhGfpOuPU7E?si=e5GUE8PCXN3l8gl4" target="_blank">
      <img src="https://img.shields.io/badge/Video_Demo-Watch-red?style=for-the-badge&logo=youtube" alt="Video Demo" />
    </a>
  </p>
</div>

---

## 🛑 The Transparent Blockchain Problem

In Web3, protocols are architected for transparency by default. While excellent for public verifiable trust, this architectural decision completely excludes enterprises. **Institutions with strict compliance requirements, treasuries protecting cash flow strategies, and DAOs handling highly sensitive payroll simply cannot use transparent rails.**

The $500M problem in DeFi MEV extraction and public payroll snooping isn't solved by retrofitting privacy later. **Privacy must be foundational architecture.**

## 🛡️ StealthPay: Privacy-by-Design on Fhenix

StealthPay treats confidentiality as a cryptographic primitive. Operating as a smart contract utilizing the **Fhenix CoFHE Coprocessor** natively on **Arbitrum Sepolia**, StealthPay creates a production-ready confidential payroll and treasury platform. 

For the first time, organizations can compute payroll distributions, enforce solvency, and process stablecoin flows **where the smart contract state itself remains fully encrypted during computation.**

### 🔑 Cryptographic Capabilities:
- **Encrypted Payroll:** Employee salaries are routed as `euint64` ciphertexts. Neither the RPC, the sequencer, nor the public can see the payload.
- **Homomorphic Arithmetic:** Salary splits and treasury deductions are calculated completely on-chain using `FHE.add()` and `FHE.sub()`.
- **Selective Disclosure:** Utilizing `FHE.allow()`, only the designated employee and the multi-sig treasury can decrypt specific transaction receipts.

---

## 🏗️ Core Architecture & Tech Stack

StealthPay bridges a highly complex FHE backend with an Apple/Linear-grade premium enterprise dashboard.

| Layer | Technology Used | Implementation Details |
|---|---|---|
| **Encrypted Compute** | Fhenix CoFHE (Arbitrum Sepolia) | `https://sepolia-rollup.arbitrum.io/rpc` |
| **Smart Contracts** | Solidity 0.8.25 | Hardhat deployed, targeting `cancun` EVM |
| **FHE Library** | `@fhenixprotocol/cofhe-contracts` | Native FHE bindings and `euint` types |
| **Frontend Shell** | Next.js 15 + React 19 | App Router, fully typed Server Components |
| **Blockchain Interop** | Wagmi v2 + Viem + RainbowKit | Connect wallet, network switching |
| **Premium UX** | TailwindCSS + Framer Motion | Smooth state transitions & zero-knowledge visualizations |

---

## 📜 FHE Smart Contracts Deep Dive

Real on-chain FHE logic lives in `contracts/ConfidentialPayroll.sol`, utilizing the official `@fhenixprotocol/cofhe-contracts`.

**Key FHE operations actively used in production:**
- `FHE.asEuint64()` — Casting encrypted client inputs into homomorphic state variables.
- `FHE.add()` / `FHE.sub()` — Zero-knowledge arithmetic on ciphertexts (never decrypted on-chain).
- `FHE.allow()` — Access Control List (ACL) granting an employee permission to decrypt their own salary.
- `FHE.allowThis()` — Allowing the contract itself to mutate and compute its own encrypted state.

### 🧪 Hardhat Testing & Deployment

The backend is fully configured for the Fhenix CoFHE Coprocessor on Arbitrum Sepolia without any ESM/CommonJS module conflicts.

```bash
# Compile FHE smart contracts
npx hardhat compile --config hardhat.config.cjs

# Run local contract tests
npx hardhat test --config hardhat.config.cjs

# Deploy directly to Arbitrum Sepolia (Fhenix Coprocessor)
npx hardhat run scripts/deploy.ts --network arbitrumSepolia --config hardhat.config.cjs
```

---

## 🚦 Running the DApp Locally

The Next.js frontend is optimized for zero-warning production builds on Vercel, securely isolating the Hardhat testing suite from the UI compilation process.

1. **Clone & Install**
```bash
git clone https://github.com/Cyptoboy777/stealthPay.git
cd stealthPay
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Production Build**
```bash
npm run build
```

---

*“The protocols that build privacy into their core architecture now will outcompete those trying to retrofit it later.”*  
**Built for the Fhenix Privacy-by-Design Ecosystem.**
