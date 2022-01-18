// scripts/deploy_upgradeable_box.js
const { upgrades } = require('hardhat')
const hre = require("hardhat")
const fs = require('fs')
const config = require('../config.json')

async function main () {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket")
  console.log('Deploying NFTMarket...')
  const nftMarket = await upgrades.deployProxy(NFTMarket)
  await nftMarket.deployed()
  console.log("nftMarket deployed to:", nftMarket.address)

  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await upgrades.deployProxy(NFT, [nftMarket.address, "Pay-A-Vegan", "VEG"])
  await nft.deployed()
  console.log("nft deployed to:", nft.address)

  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  await nft.addMinter(owner.address)

  let contract_owner = config['chains'][hre.network.name]['contract_owner']['address']
  let envChain = config['chains'][hre.network.name]['chain']

  let nftmarketaddress = nftMarket.address
  let nftaddress = nft.address
  config['deployed'] = {
    nftmarketaddress,
    nftaddress,
    envChain,
    contract_owner
  }

  fs.writeFileSync('config.json', JSON.stringify(config, null, 4))
}

main();
