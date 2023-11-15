const hre = require("hardhat");

async function main() {
  // Get the Points smart contract
  const degenContract = await hre.ethers.getContractFactory("DegenToken");

  console.log("\n=========Deploying DegenToken Contract ============ \n");
  // Deploy it
  const degen = await degenContract.deploy();
  await degen.waitForDeployment();

  // Display the contract address
  console.log(
    `DegenToken deployed to: ${degen.target}, on Avalanche Fuji (C-Chain)`
  );
}

// Hardhat recommends this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
