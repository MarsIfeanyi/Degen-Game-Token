require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const FORK_FUJI = true;
const FORK_MAINNET = false;
let forkingData = undefined;

if (FORK_MAINNET) {
  forkingData = {
    url: "https://api.avax.network/ext/bc/C/rpcc",
  };
}
if (FORK_FUJI) {
  forkingData = {
    url: "https://avalanche-fuji-c-chain.publicnode.com",
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    fuji: {
      url: "https://avalanche-fuji-c-chain.publicnode.com",
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY], // we use a .env file to hide our wallets private key
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.SNOWTRACE_API_KEY, // we use an .env file to hide our Snowtrace API KEY
  },
};

// npx hardhat verify <contract address> <arguments> --network <network>

// $ npx hardhat run scripts/deploy.js --network fuji

// npx hardhat verify 0x5d7005b3A59c991454aA4889c6E6780283e17eC2 --network fuji
