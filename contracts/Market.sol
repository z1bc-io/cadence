// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import { IAuctionHouse } from './interfaces/IAuctionHouse.sol';
import "hardhat/console.sol";

contract NFTMarket is IAuctionHouse, Initializable, ReentrancyGuardUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _itemIds;
  CountersUpgradeable.Counter private _itemsSold;

  uint256 listingPrice;
  uint256 public duration;
  string public version;

  // The minimum percentage difference between the last bid amount and the current bid
  uint8 public minBidIncrementPercentage;

  // The duration of a single auction
  //uint256 public duration;

  // The active auction
  IAuctionHouse.Auction public auction;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  function initialize(uint8 _minBidIncrementPercentage) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    minBidIncrementPercentage = _minBidIncrementPercentage;
    listingPrice = 0.025 ether;
    duration = 1000 * 60 * 60 * 24;
  }

	function _authorizeUpgrade(address) internal override onlyOwner {
    // in general, nothing needs to be done here, because this function
    // will not be called when deploying the contract. However, resetting
    // version to "1.0" ensures that downgrading via an upgrade is possible (although risky)
		version = "1.0";
	}

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
    bool auction;
    uint256 startTime;
    uint256 endTime;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool auction
  );

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  /* Places an item for sale on the marketplace */
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false,
      false,
      0,
      0
    );

    IERC721Upgradeable(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false,
      false
    );
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createAuction(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    //uint price = idToMarketItem[itemId].price;
    //uint tokenId = idToMarketItem[itemId].tokenId;
    //require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    idToMarketItem[itemId].auction = true;
    idToMarketItem[itemId].startTime = block.timestamp;
    idToMarketItem[itemId].endTime = idToMarketItem[itemId].startTime + duration;
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    //require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    bytes memory a = abi.encodePacked(idToMarketItem[itemId].endTime, ": Auction has not started yet");
    require(0 < idToMarketItem[itemId].endTime, string(a));

    bytes memory b = abi.encodePacked(idToMarketItem[itemId].endTime, ": Auction expired");
    require(block.timestamp < idToMarketItem[itemId].endTime, string(b));

    IAuctionHouse.Auction memory _auction = auction;
    require(
        msg.value >= _auction.amount + ((_auction.amount * minBidIncrementPercentage) / 100),
        'Must send more than last bid by minBidIncrementPercentage amount'
    );
    auction.amount = msg.value;
    auction.bidder = payable(msg.sender);

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721Upgradeable(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    idToMarketItem[itemId].auction = false;
    _itemsSold.increment();
    payable(owner()).transfer(listingPrice);
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns onlyl items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}
