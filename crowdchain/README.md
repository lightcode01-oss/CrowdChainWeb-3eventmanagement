# CrowdChain – Web3 Event Management & Ticketing

CrowdChain is a complete production-ready web application built on the MERN stack with Ethereum smart contract integration, designed to solve the problems of fake ticketing and crowd congestion at events. Let users mint verifiable event tickets tied to their MetaMask addresses.

## Features
- **MetaMask Wallet Auth**: Seamless Web3 login.
- **Smart Contracts**: Tickets are securely mapped to wallets on-chain.
- **QR Code Entry**: Scalable and secure physical entry scanning.
- **Real-time Crowd Analytics**: Instant monitoring of capacity limit.

## Prerequisites
- Node.js (v18+)
- MongoDB daemon running (or MongoDB URI)
- MetaMask extension installed in the browser

## Setup Instructions

### 1. Database Start
Ensure MongoDB is running locally on port 27017, or configure `server/.env`.

### 2. Backend Server
```bash
cd crowdchain/server
npm install
npm run dev
```
The server should start on `http://localhost:5000`.

### 3. Blockchain Network
```bash
cd crowdchain/blockchain
npm install
npx hardhat node
```
This runs a local Hardhat Ethereum node.
In a new terminal:
```bash
cd crowdchain/blockchain
npx hardhat run scripts/deploy.js --network localhost
```
Note down the deployed contract address if you intend to link it strictly in the client.

### 4. Frontend Client
```bash
cd crowdchain/client
npm install
npm run dev
```
Open `http://localhost:5173` to interact with the application.

## Technologies Used
- React (Vite)
- Tailwind CSS
- Express.js
- MongoDB & Mongoose
- Hardhat, Ethers.js, Solidity
- React QR Reader

## Future Improvements
- Link backend `POST /tickets/buy` exactly to Hardhat localhost deployment hash checks.
- Add JWT verification middleware for secure Admin routes.
