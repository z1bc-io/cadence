const web3 = require('web3')
const hre = require("hardhat")
const nftPasswords = require('../.nftpassword.json')
const config = require(`../mkconfig.${hre.network.name}.json`)

/****************************************
 * Set passwords into the smart contract
 * 
 * 
 */
const fromIndex = 0;
const toIndex = nftPasswords.length;
const updatePassword = false; //true == update password on chain, false == check only.


async function main() {
  let nftAddress = config['deployed']['nftaddress']
  const MKNFT = await hre.ethers.getContractFactory("MKNFT")
  const nftContract = await MKNFT.attach(nftAddress)


  for (var i=fromIndex;i< toIndex;i++){
    let index = nftPasswords[i].index;
    let password = nftPasswords[i].password;
    let hash = nftPasswords[i].hash;
    console.log(i+","+password+","+hash);
    if (updatePassword){
      console.log("Setting hash...");
      transaction = await nftContract.setPasswordHash(index , hash);
      tx = await transaction.wait()
      console.log(tx.events);  
    }
    console.log("Checking password...");
    let check = await nftContract.checkPassword(index, password);
    console.log("Checked="+check);
    if (!check) break
  }


}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

