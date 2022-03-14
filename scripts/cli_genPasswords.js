const web3 = require('web3')
const fs = require('fs');

/***********************************
 * Generate NFT Passwords
 * 
 * Only run this when need to generate new passwords
 * This file also calculate the correctponding hash to be used to import to the smart contract
 * 
 * Password index starts with 1. (not zero)
 ***********************************/

const NUMPASSWORD = 52

function genNewPassword(){
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 20;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber +1);
   }
  return password;   
}

async function main() {
  let passwords = [];
  for (var i=1; i < NUMPASSWORD+1 ; i++){
    let pw = genNewPassword();
    let hash = web3.utils.soliditySha3(pw)
    let obj = {
      'tokenId':i,
      'password':pw,
      'hash':hash,  
    }
    passwords.push(obj);
  }
  console.log(passwords);
  fs.writeFileSync('.nftpassword.json', JSON.stringify(passwords,null,4))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

