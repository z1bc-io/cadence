const hre = require("hardhat");
const fs = require('fs');
const monkey_config = require('../monkey_config.json')

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("MKMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("MKNFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let contract_owner = monkey_config[hre.network.name]['contract_owner']['address']
  let envChain = monkey_config[hre.network.name]['chain']

  let nftmarketaddress = nftMarket.address
  let nftaddress = nft.address


  
  config['deployed'] = {
    nftmarketaddress,
    nftaddress,
    envChain,
    contract_owner
  }

  fs.writeFileSync(`mkconfig.${hre.network.name}.json`, JSON.stringify(config, null, 4))

  /*
  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  export const envChainName = "${envChain.name}"
  export const envChainId = "${envChain.id}"
  export const contract_owner = "${contract_owner}"

  let data = JSON.stringify(config)
  fs.writeFileSync('mkconfig.json', JSON.parse(data))
  */

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
