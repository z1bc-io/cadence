
const contract_config = require('../contract_config.json')
const { ethers, upgrades } = require('hardhat');

async function main () {
  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  let listingPrice = await market.getListingPrice()
  console.log("Test5 listingPrice", listingPrice)
  let version = await market.version()
  console.log("Test5 version", version)
}

main();
