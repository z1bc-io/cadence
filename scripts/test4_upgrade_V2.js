
const contract_config = require('../contract_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main () {
  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const NFTMarketV2 = await hre.ethers.getContractFactory('NFTMarketV2');
  console.log('Test4 Upgrading NFTMarketV2...');
  await upgrades.upgradeProxy(marketContractAddress, NFTMarketV2);
  console.log('Test4 NFTMarketV2 upgraded');
}

main();
