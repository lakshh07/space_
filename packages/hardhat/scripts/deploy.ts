import { ethers } from "hardhat";

async function main() {
  const space = await ethers.deployContract("Space_");

  await space.waitForDeployment();

  console.log(`space contract deployed to ${space.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
