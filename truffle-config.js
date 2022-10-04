const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require("fs");
require('dotenv').config()

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.RPC_URL),
      network_id: '5'
    },
  },
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/contracts/build",
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.16",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: 'SKU6P2QKM157TG81K5ZHBAECX9BR8UE993'
  },
};