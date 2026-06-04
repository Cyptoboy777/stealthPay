<div align="center">
  <img src="public/logo.png" alt="StealthPay Logo" height="120" />
  <h1>StealthPay V3</h1>
  <p><strong>Privacy-by-Design Payroll & Treasury Infrastructure. Built on Fhenix & Privara.</strong></p>
</div>

---

## 🎥 Live Demo & Walkthrough

- **Live Vercel Deployment:** [https://stealth-pay-iota.vercel.app/](https://stealth-pay-iota.vercel.app/)
- **Demo Video:** [Watch on YouTube](https://youtu.be/mhGfpOuPU7E?si=e5GUE8PCXN3l8gl4)

---

## 🛑 The Institutional Gap
Most protocols are architected for transparency by default. That architectural decision defines the user base. Institutions with compliance requirements, treasuries protecting cash flow strategies, and DAOs handling sensitive payroll **can't use transparent rails.** Not won't. *Can't.*

The $500M problem in DeFi MEV extraction and public payroll snooping isn't solved by retrofitting privacy later. **Privacy must be foundational architecture.**

## 🛡️ StealthPay: Privacy-by-Design
StealthPay treats confidentiality as a primitive, not a patch. Using **Fhenix's Fully Homomorphic Encryption (FHE)** and the **Privara SDK**, we have built a production-ready confidential payroll and treasury platform where data stays completely encrypted during computation. 

StealthPay unlocks true **Confidential Stablecoin Flows**:
- **Privacy-preserving** — Salaries, treasury balances, and splits stay encrypted.
- **Programmable** — Full smart contract logic computes on encrypted state (e.g., FHE-powered tax logic).
- **Verifiable on-chain** — Selective disclosure allows ZKP compliance auditing without revealing granular row-level data.

---

## 🏆 Wave 5 Final Submission (Production Ready)

StealthPay represents sustained technical progress and iteration across all 5 waves of the Buildathon. 

### 🌊 Progress & Iteration
- **Wave 1 & 2 (Foundation):** Core Fhenix smart contract architecture, encrypted types (`euint`), and basic wallet abstraction.
- **Wave 3 (Integration):** Integration with **Privara SDK** for confidential payment rails and programmable transfers.
- **Wave 4 (Compliance):** Implementation of Selective Disclosure proofs and FHE-based solvency enforcement mechanisms.
- **Wave 5 (Final Polish):** Total UI/UX overhaul to an Apple/Linear-grade premium enterprise dashboard. Zero-knowledge workflow visualizations, Gemini AI integration, and production deployment on Vercel with zero compiler warnings.

---

## 🏗️ Core Architecture

### 1. Fhenix CoFHE Stack Integration
- **On-chain Encryption:** Smart contracts utilize `euint` and `FHE.select` to compute payroll routing without ever decrypting the payload.
- **Client-Side:** Seamless integration of `fhenixjs` to allow employers to encrypt payroll CSVs locally before broadcasting to the network.

### 2. Privara Confidential Rails
- **Stealth Splitter:** Employees can securely and privately route their incoming encrypted payroll into multiple strategies (e.g., 55% Main, 25% Savings, 20% Yield) utilizing Privara's confidential stablecoin interactions.

### 3. Treasury Multi-Sig & Solvency
- Multi-sig treasurers verify that aggregate payout vectors do not exceed current treasury limits—all computed via FHE, ensuring the treasury remains solvent without exposing exactly who is getting paid what.

### 4. Premium Enterprise UX
- We ditched the "hackathon cyberpunk" look for a **premium, minimalist, trust-inspiring** design (inspired by Linear and Apple). 
- Features a **Live Fhenix Network Monitor**, buttery-smooth Framer Motion interactions, and fully typed WebAssembly webpack optimizations for Vercel.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Encrypted Compute** | Fhenix (Nitrogen Testnet) / CoFHE Stack |
| **Confidential Payments** | Privara SDK |
| **Smart Contracts** | Solidity 0.8.25 + `@fhenixprotocol/cofhe-contracts` |
| **FHE Operations** | `euint64`, `FHE.add`, `FHE.sub`, `FHE.allow` |
| **Frontend Shell** | Next.js 15 (App Router) + React 19 |
| **Blockchain Interop** | Wagmi v2 + Viem + RainbowKit |
| **Design System** | TailwindCSS + Framer Motion + GSAP |
| **Dev Tooling** | Hardhat 2 + `@nomicfoundation/hardhat-toolbox` |
| **State & Toasts** | Zustand + Sonner |

---

## 📜 Smart Contracts

Real on-chain FHE logic lives in `contracts/ConfidentialPayroll.sol`, compiled against `@fhenixprotocol/cofhe-contracts`.

| Contract | Description |
|---|---|
| `ConfidentialPayroll.sol` | Core payroll contract using `euint64` encrypted salaries |

**Key FHE operations used:**
- `FHE.asEuint64()` — convert encrypted input from client
- `FHE.add()` / `FHE.sub()` — arithmetic on ciphertexts (never decrypted on-chain)
- `FHE.allow()` — grant employee permission to decrypt their own salary
- `FHE.allowThis()` — allow contract to update its own encrypted state

```bash
# Compile smart contracts
npx hardhat compile --config hardhat.config.cjs

# Run tests
npx hardhat test --config hardhat.config.cjs

# Deploy to Fhenix Nitrogen Testnet
npx hardhat run scripts/deploy.ts --network fhenixNitrogen --config hardhat.config.cjs
```

---

## 🚦 Running Locally

1. **Clone & Install**
```bash
git clone https://github.com/Cyptoboy777/stealthpay.git
cd stealthpay
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Deploy to Vercel**
The codebase is 100% production-ready. Simply import the repository to Vercel. No Webpack or WASM build errors.

---

*“The protocols that build privacy into their core architecture now will outcompete those trying to retrofit it later.”*  
**Built for the Fhenix Privacy-by-Design dApp Buildathon.**
