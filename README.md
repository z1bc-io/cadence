# Setup
## In a first terminal
$ git clone git@github.com:tong2984a/cadence.git SlashFIRE

$ cd SlashFIRE

$ node version
> v16.10.0

$ yarn

$ npx hardhat node

## In a second terminal
$ cd SlashFIRE

$ npx hardhat run scripts/deploy_nft.js --network localhost

$ npx hardhat run scripts/test1_create_nft.js --network localhost

$ npx hardhat run scripts/test2_deploy_more.js --network localhost

$ npx hardhat run scripts/test3_royalties.js --network localhost

$ npx hardhat run scripts/test4_upgrade_V2.js --network localhost

$ npx hardhat run scripts/test5_V2.js --network localhost

$ npx hardhat run scripts/test6_upgrade_V3.js --network localhost

$ npx hardhat run scripts/test7_V2.js --network localhost

# Configuration
- !!!save your private key file in a '.secret' file and put it at the SlashFIRE folder
