import fs from 'fs';
import { ethers } from 'ethers';

async function main() {
  console.log("Starting manual deploy via standard ethers (Bypassing Hardhat/Node 23 bug)...");
  
  // Connect to the locally running Hardhat node
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

  // Hardhat's default first account private key (Account #0)
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Wallet connected:", wallet.address);

  // Read the compiled smart contract ABI and Bytecode from Hardhat's output
  const artifactPath = "./artifacts/contracts/CrowdTicket.sol/CrowdTicket.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  console.log("Deploying contract to local network...");
  const contract = await factory.deploy();
  
  // Wait for the deployment transaction to be mined
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`\n✅ CrowdTicket successfully deployed to: ${contractAddress}\n`);
}

main().catch((error) => {
  console.error("Manual Deployment Failed:", error);
  process.exit(1);
});
