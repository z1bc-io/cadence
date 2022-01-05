const hre = require("hardhat");
const fs = require('fs');
const contract_config = require('../contract_config.json')
const allowance_config = require('../allowance_config.json')

async function main() {
  let accounts = await ethers.getSigners()
  let owner = accounts[0]

  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const Token = await hre.ethers.getContractFactory("NFT")
  const token = await Token.attach(nftContractAddress)

  let transaction = await token.connect(owner).createToken("https://ipfs.infura.io/ipfs/QmUHuUuKPXQLgbRrkEceHAYNaH7HKxMbiraGMLVUh9MnoB")
  let tx = await transaction.wait()
  let event = tx.events[0]
  let value = event.args[2]
  let token_id = value.toNumber()

  transaction = await token.connect(owner).approve(market.address, token_id)
  tx = await transaction.wait()
  console.log("Test3 approved successfully")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
