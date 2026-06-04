import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer, treasurer] = await ethers.getSigners();

  console.log("─────────────────────────────────────────");
  console.log("  StealthPay - ConfidentialPayroll Deploy");
  console.log("─────────────────────────────────────────");
  console.log("Deployer  :", deployer.address);
  console.log("Treasurer :", treasurer ? treasurer.address : "Use separate address");
  console.log("Network   :", (await ethers.provider.getNetwork()).name);
  console.log("");

  const treasurerAddress = treasurer?.address ?? deployer.address;

  console.log("Deploying ConfidentialPayroll...");
  const ConfidentialPayroll = await ethers.getContractFactory("ConfidentialPayroll");
  const contract = await ConfidentialPayroll.deploy(treasurerAddress);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✓ ConfidentialPayroll deployed to:", address);

  // Save the deployed address and ABI to a file for the frontend
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    contractAddress: address,
    deployer: deployer.address,
    treasurer: treasurerAddress,
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("");
  console.log("✓ Deployment info saved to src/contracts/deployment.json");
  console.log("─────────────────────────────────────────");
  console.log("Ready to integrate with frontend!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
