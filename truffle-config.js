const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;
require('dotenv').config({path: '.env'});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      network_id:"1337",
      host:"127.0.0.1"
    },
    //For Connecting to Metamask using HDWalletProvider
    ganache_local: {
      provider: function() {
          return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", MetaMaskAccountIndex )
      },
      network_id: 1337
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/f5964c1824c1484a87b79cccdf14251c", MetaMaskAccountIndex)
      },
      network_id: 3
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/f5964c1824c1484a87b79cccdf14251c", MetaMaskAccountIndex)
      },
      network_id: 5
    }
  },
  compilers: {    
    solc: {
      version: "^0.6.1"
    }
  }
};
