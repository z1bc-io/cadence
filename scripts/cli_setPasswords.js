const web3 = require('web3')
const config = require('../mkconfig.json')
const hre = require("hardhat")

async function main() {
    let hash = web3.utils.soliditySha3('40Lf4S&ufXjQcd*Eg8Yi')
    let nftAddress = config['deployed']['nftaddress']
    const MKNFT = await hre.ethers.getContractFactory("MKNFT")
    const nftContract = await MKNFT.attach(nftAddress)


    await nftContract.setPasswordHash(0 , hash);
    console.log("Hash ="+hash);
    let check = await nftContract.checkPassword(0, '40Lf4S&ufXjQcd*Eg8Yi');
    console.log(check);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

