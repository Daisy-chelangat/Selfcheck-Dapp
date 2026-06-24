# SelfCheck dApp ⚡

> Accountability has consequences. Stake ETH on your personal goals — succeed and get it back, fail and fund the winners.

![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?style=flat&logo=solidity)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=flat&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🎯 What is SelfCheck?

SelfCheck is a decentralized accountability dApp built on Ethereum. In a world where people lose hours to social media and forget what truly matters, SelfCheck puts real skin in the game.

You set a personal goal, stake ETH as your commitment, and check in regularly to prove your consistency. Complete your goal and get your stake back. Fail and your stake funds the community pool — shared among everyone who succeeded.

**Accountability is no longer just a promise. It's a financial commitment.**

---

## ✨ Features

- 🎯 **Solo Mode** — Set personal goals and stake ETH against yourself
- 🤝 **Partner Mode** — Challenge a friend, you both stake and hold each other accountable
- ✅ **Partner Check-in Verification** — In partner mode, your partner must approve each check-in
- ⏳ **Auto-approve** — If partner ignores a check-in request for 24hrs, it auto-approves
- 🔥 **Flexible Check-in Frequency** — Daily, every 2 days, or weekly
- 🏆 **Community Pool** — Failed stakes (95%) go to a shared pool rewarding successful users
- 📊 **Progress Tracking** — Visual progress bars and countdowns for every goal
- 🏅 **Leaderboard** — Top performers ranked by goals completed
- ⛓️ **100% On-Chain** — All progress recorded immutably on Ethereum

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity 0.8.28 |
| Development Framework | Hardhat 2.28.6 |
| Frontend Framework | React 18 + Vite |
| Blockchain Library | ethers.js v6 |
| Styling | Styled Components |
| Wallet | MetaMask |
| Network | Ethereum Sepolia Testnet |
| Node Provider | Alchemy |
| Package Manager | pnpm |
| Version Control | Git + GitHub |

---

## 📋 Smart Contract

| Detail | Value |
|--------|-------|
| Network | Ethereum Sepolia Testnet |
| Contract Address | `0x2057C368aE4b1dF5322b8c0d1cCC53Ad3A0A151B` |
| Solidity Version | 0.8.28 |
| License | MIT |

### Contract Functions

**Solo Mode**
- `createSoloGoal()` — Create a goal and stake ETH
- `checkIn()` — Record a check-in on-chain
- `completeGoal()` — Claim stake back after successful completion
- `failGoal()` — Mark goal as failed, stake goes to community pool

**Partner Mode**
- `createPartnerGoal()` — Create a goal and invite a partner
- `acceptPartnerGoal()` — Partner joins and matches the stake
- `approveCheckIn()` — Partner approves a check-in request
- `rejectCheckIn()` — Partner rejects a check-in request
- `autoApproveCheckIn()` — Auto-approve after 24hrs of no response
- `resolvePartnerGoal()` — Settle the goal after deadline

**Pool**
- `distributePool()` — Distribute community pool to winners (owner only)
- `withdrawTreasury()` — Withdraw platform treasury (owner only)

---

## 🎮 How It Works

### Solo Mode

Set your goal + description
Choose deadline and check-in frequency (daily/2 days/weekly)
Stake ETH as your commitment
Check in regularly within your frequency window
Hit 80% of required check-ins by deadline → success, stake returned
Miss too many check-ins → fail, 95% stake to community pool

### Partner Mode

Create a goal and invite a friend by wallet address
Friend accepts and matches your stake
Both check in regularly
Each check-in requires partner approval
Partner ignores for 24hrs → auto-approved
Deadline hits → one succeeds, one fails → loser's stake to winner
Both succeed → stakes returned + pool bonus
Both fail → both stakes to community pool

### Stake Distribution

Goal completed  → 100% stake returned to user

Goal failed     → 95% to community pool

5% to platform treasury

Partner wins    → gets their stake + winner's share of loser's stake

5% of loser's stake to treasury

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- pnpm
- MetaMask browser extension
- Sepolia testnet ETH (get from [Alchemy Faucet](https://sepoliafaucet.com))

### Clone the repo
```bash
git clone https://github.com/Daisy-chelangat/Selfcheck-Dapp.git
cd Selfcheck-Dapp
```

### Smart Contract Setup
```bash
# install dependencies
pnpm install

# compile contract
npx hardhat compile

# run tests
npx hardhat test

# deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### Environment Variables (root)
Create a `.env` file in the root:

SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

PRIVATE_KEY=your_metamask_private_key

ETHERSCAN_API_KEY=your_etherscan_api_key

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

### Frontend Environment Variables
Create a `.env` file inside `frontend/`:

VITE_ALCHEMY_KEY=your_alchemy_api_key

---

## 📁 Project Structure

selfcheck/

│

├── contracts/

│   └── SelfCheck.sol          ← main smart contract

│

├── scripts/

│   └── deploy.js              ← deployment script

│

├── test/

│   └── SelfCheck.test.js      ← contract tests

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── Navbar.jsx

│   │   │   ├── GoalCard.jsx

│   │   │   ├── CheckInButton.jsx

│   │   │   ├── ProgressBar.jsx

│   │   │   ├── PartnerInvite.jsx

│   │   │   └── Leaderboard.jsx

│   │   │

│   │   ├── pages/

│   │   │   ├── Home.jsx

│   │   │   ├── Dashboard.jsx

│   │   │   ├── CreateGoal.jsx

│   │   │   ├── MyGoals.jsx

│   │   │   └── Community.jsx

│   │   │

│   │   ├── hooks/

│   │   │   ├── useWallet.js

│   │   │   ├── useContract.js

│   │   │   └── useGoals.js

│   │   │

│   │   ├── utils/

│   │   │   ├── contract.js

│   │   │   └── helpers.js

│   │   │

│   │   └── styles/

│   │       └── GlobalStyles.js

│   │

│   └── vite.config.js

│

├── hardhat.config.js

├── .env                       ← never commit this

├── .gitignore

└── README.md

---

## 🎨 Design Decisions

**Why ETH staking?**
Most accountability tools fail because there's zero consequence for skipping. Real financial stakes change behavior — losing ETH hurts enough to keep you honest.

**Why honor system for solo mode?**
Blockchains can verify transactions but cannot verify real-world actions (the oracle problem). For solo mode, the financial stake itself is the accountability mechanism. Future versions could integrate Chainlink oracles for verified data.

**Why partner verification?**
Partner mode adds a social layer — a real person confirms your check-ins. This removes the honor system entirely and creates genuine mutual accountability.

**Why 95/5 pool split?**
95% to community pool rewards the committed users directly. 5% to treasury ensures platform sustainability without requiring external funding.

**Why 80% check-in threshold?**
Life happens. A strict 100% requirement is unrealistic. 80% allows for missed days while still demanding genuine commitment.

---

## 👩‍💻 Author

**Daisy Chelangat**
IT Student | Aspiring Full-Stack Web3 Developer

- GitHub: [@Daisy-chelangat](https://github.com/Daisy-chelangat)
- Building in public 🚀

---

## 📄 License

This project is licensed under the MIT License.

---

*Built with 💜 on Ethereum Sepolia Testnet*