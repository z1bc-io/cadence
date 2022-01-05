const hre = require("hardhat");
const fs = require('fs');
const contract_config = require('../contract_config.json')
const allowance_config = require('../allowance_config.json')

async function main() {
  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.attach(nftContractAddress)

  let listingPrice = await market.getListingPrice()
  listingPrice = listingPrice.toString()
  let auctionPriceNumber = 1
  const auctionPrice = ethers.utils.parseUnits(auctionPriceNumber.toString(), 'ether')

  for (let i = 0; i < 10; i++) {
    let transaction = await nft.createToken("https://ipfs.infura.io/ipfs/QmUHuUuKPXQLgbRrkEceHAYNaH7HKxMbiraGMLVUh9MnoB")
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    console.log("Test1 nft createToken tokenId:", tokenId)
    transaction = await market.createMarketItem(nft.address, tokenId, auctionPrice, { value: listingPrice })
    tx = await transaction.wait()
    console.log("Test1 market createMarketItem tokenId:", tokenId)
  }

  let items = await market.fetchMarketItems()
  for (let i = 0; i < 10; i++) {
    await market.createAuction(nftContractAddress, items[i].itemId)
  }
  console.log("Test1 createAuction completed.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
