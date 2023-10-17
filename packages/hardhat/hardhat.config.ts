import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `${process.env.MUMBAI_ALCHEMY_KEY}`,
      accounts: [`0x${process.env.PK}`],
    },
    polygon: {
      url: `${process.env.POLYGON_ALCHEMY_KEY}`,
      accounts: [`0x${process.env.PK}`],
    },
  },
};

export default config;
