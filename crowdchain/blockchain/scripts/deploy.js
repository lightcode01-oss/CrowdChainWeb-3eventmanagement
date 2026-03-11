import hre from "hardhat";

async function main() {
  console.log("Deploying CrowdTicket contract...");

  const CrowdTicketFactory = await hre.ethers.getContractFactory("CrowdTicket");
  const crowdTicket = await CrowdTicketFactory.deploy();

  await crowdTicket.waitForDeployment();

  console.log(`CrowdTicket deployed to ${await crowdTicket.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
