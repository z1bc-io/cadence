require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-etherscan');
// hardhat.config.ts

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
//const ALCHEMY_API_KEY = fs.readFileSync(".alchemy").toString().trim() || "";

module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
      chainId: 31337
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraId}`, // or any other JSON-RPC provider
      accounts: [privateKey]
    },
/*    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [privateKey]
    },
*/    
    rinkeby: {
     url: `https://rinkeby.infura.io/v3/${infuraId}`, //Infura url with projectId
     accounts: [privateKey], // add the account that will deploy the contract (private key)     
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey]
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: "5XSKX99TC688PD63RBAFC4QE5SCZHHCKUZ"
  },
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
