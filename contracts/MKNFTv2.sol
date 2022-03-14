// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

import "hardhat/console.sol";

//https://docs.ethers.io/v4/cookbook-signing.html


contract MKNFTv2 is ERC721URIStorage, ERC2981, Ownable  {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    bytes32 [52] mintPasswords; 
    string myContractURI = "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fmonkey-contract.json?alt=media&token=0c19430b-2c88-4b3c-89f2-92d85ffee1d1";

    constructor(address marketplaceAddress) ERC721("Monkey King", "MONKEYKING") {
        contractAddress = marketplaceAddress;
        setRoyaltyInfo(owner(), 1000); //1000 basis points = 10%
    }

    function setRoyaltyInfo(address _receiver, uint96 _royaltyFee) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFee); //Fee in basis points
    }

    function setPasswordHash(uint index, bytes32 _hash) public onlyOwner {
        mintPasswords[index] = _hash;
    }

    function setPasswordHashArray(bytes32[52] memory _hashArray) public onlyOwner {
        mintPasswords = _hashArray;
    }

    function checkPassword(uint index, string memory _password) public view returns (bool){
        return (keccak256(abi.encodePacked(_password)) == mintPasswords[index]);
    } 

    function createToken(string memory _password, string memory tokenURI) public returns (uint) {

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        //newItemId starts with 1, password index starts with 0.
        require(checkPassword(newItemId-1, _password), "incorrect password");

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function burn(uint256 tokenId) public onlyOwner{
        _burn(tokenId);
    }

    function contractURI() public view returns (string memory) {
        return myContractURI;
    }

    function setContractURI(string memory _contractURI) public onlyOwner{
        myContractURI = _contractURI;
    }

     function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
