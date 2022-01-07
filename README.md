# Setup
### In a first terminal
     $ git clone git@github.com:tong2984a/cadence.git SlashFIRE

     $ cd SlashFIRE

     $ node --version
     > v16.10.0

     $ yarn

     $ npx hardhat node

### In a second terminal
     $ cd SlashFIRE

     $ npx hardhat run scripts/deploy_nft.js --network localhost

     $ npx hardhat run scripts/test1_create_nft.js --network localhost

     $ npx hardhat run scripts/test2_deploy_more.js --network localhost

     $ npx hardhat run scripts/test3_royalties.js --network localhost

     $ npx hardhat run scripts/test4_upgrade_V2.js --network localhost

     $ npx hardhat run scripts/test5_V2.js --network localhost

     $ npx hardhat run scripts/test6_upgrade_V3.js --network localhost

     $ npx hardhat run scripts/test7_V3.js --network localhost

### Configuration
-  :exclamation: :point_right: save your private key file in a '.secret' file and put it at the SlashFIRE folder

# Setup -- TestNet
Here are some differences when compared to Setup -- localhost
- hardhat.config.js now includes rinkeby network settings
- you will need to register for an infura.io account, and include your project id in a '.infuraid' file and put that at the SlashFIRE folder
- You can close the first terminal because we will be using the TestNet instead.
- Repeat steps under the above "In a second terminal" by using rinkeby instead of localhost.
- Remember to give yourself (i.e. your .secret account) some eth from online faucets.

Refer to the above "In a second terminal"
     $ cd SlashFIRE

     $ npx hardhat run scripts/deploy_nft.js --network rinkeby

     $ npx hardhat run scripts/test1_create_nft.js --network rinkeby

     $ npx hardhat run scripts/test2_deploy_more.js --network rinkeby

     $ npx hardhat run scripts/test3_royalties.js --network rinkeby

     $ npx hardhat run scripts/test4_upgrade_V2.js --network rinkeby

     $ npx hardhat run scripts/test5_V2.js --network rinkeby

     $ npx hardhat run scripts/test6_upgrade_V3.js --network rinkeby

     $ npx hardhat run scripts/test7_V3.js --network rinkeby
