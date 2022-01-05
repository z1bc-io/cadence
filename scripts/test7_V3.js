
const contract_config = require('../contract_config.json')
const { ethers, upgrades } = require('hardhat');

async function main () {
  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarketV3")
  const market = await Market.attach(marketContractAddress)
  let transaction = await market.incrementListingPrice()
  let tx = await transaction.wait()
  let listingPrice = await market.getListingPrice()
  console.log("Test7 listingPrice", listingPrice)
  let version = await market.version()
  console.log("Test7 version", version)
}

main();
