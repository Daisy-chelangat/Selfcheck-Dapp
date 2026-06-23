const hre = require("hardhat");

async function main() {
  console.log("Deploying SelfCheck contract...");

  const SelfCheck = await hre.ethers.getContractFactory("SelfCheck");
  const selfCheck = await SelfCheck.deploy();

  await selfCheck.waitForDeployment();

  const address = await selfCheck.getAddress();

  console.log("SelfCheck deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });