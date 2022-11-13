// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./kepeng.sol";

contract Auction is ERC1155Holder {
    using SafeMath for uint256;
    address public creator; // The address of the auction creator
    address public nftSeller; // the address of the nft seller
    uint256 public tokenId; // The id of the token
    bool public isEnded; // If the the auction is cancelled
    address public nftAddress; // The address of the NFT contract
    IERC1155 nft1155; // The NFT token
    address public manager; // address of auction manager
    KEPENG kepeng; // KPG smart contract address
    bool public isEndedByCreator;
    address public baliolaWallet;
    uint256 public initialNftAmount; // initial amount of nft
    uint256 public availableNFT; // total of available nft
    uint256 public price; // the price per 1 nft
    uint256 public index = 0; // buyer tracker
    mapping(uint256 => Buyer) public buyers; // mapping for buyer

    enum AuctionState {
        OPEN,
        ENDED_BY_CREATOR,
        OUT_OF_SUPPLY
    }

    struct Buyer {
        address buyer;
        uint256 hasPayed;
        uint256 amount;
        uint256 timestamp;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "only manager can call");
        _;
    }

    // Auction constructor
    constructor(
        address _creator,
        address _baliola,
        address _nftAddress,
        uint256 _tokenId,
        uint256 _nftAmount,
        uint256 _price,
        KEPENG _kepeng,
        address _nftSeller
    ) {
        creator = _creator; // The address of the auction creator
        nft1155 = IERC1155(_nftAddress); // The nft contract instance
        nftAddress = _nftAddress;
        tokenId = _tokenId; // The id of the token
        kepeng = _kepeng; // kepeng address smart contracts address
        nftSeller = _nftSeller;
        manager = msg.sender;
        baliolaWallet = _baliola;
        initialNftAmount = _nftAmount;
        availableNFT = _nftAmount;
        price = _price;
    }

    function GetAllBuyers()
        external
        view
        returns (
            address[] memory buyer,
            uint256[] memory hasPayed,
            uint256[] memory amount,
            uint256[] memory timestamp
        )
    {
        buyer = new address[](index);
        hasPayed = new uint256[](index);
        amount = new uint256[](index);
        timestamp = new uint256[](index);

        for (uint256 i = 0; i < index; i++) {
            buyer[i] = buyers[i].buyer;
            hasPayed[i] = buyers[i].hasPayed;
            amount[i] = buyers[i].amount;
            timestamp[i] = buyers[i].timestamp;
        }

        return (buyer, hasPayed, amount, timestamp);
    }

    function refill(address _creator, uint256 amount)
        external
        onlyManager
        returns (bool)
    {
        require(_creator == creator, "only creator can refill");
        availableNFT = availableNFT + amount;

        emit Refilled(amount);

        return true;
    }

    function buy(
        address _buyer,
        uint256 _amount,
        uint256 txFee
    ) external onlyManager returns (bool) {
        require(_buyer != creator, "creator cannot buy the nft!");
        require(availableNFT != 0, "out of supply! no nft is being selled!");
        require(_amount <= availableNFT, "not enough available nft!");
        require(
            getAuctionState() == AuctionState.OPEN,
            "can only buy nft when auction is open!"
        );
        require(
            txFee == price * _amount,
            "can only buy if the fee is correct!"
        );

        buyers[index] = Buyer({
            buyer: _buyer,
            hasPayed: txFee,
            amount: _amount,
            timestamp: block.timestamp
        });

        index++;
        availableNFT = availableNFT - _amount;

        nft1155.safeTransferFrom(address(this), _buyer, tokenId, _amount, "");
        kepeng.transfer(nftSeller, txFee);

        emit hasBought(_buyer, _amount);

        if (availableNFT == 0) {
            emit OutOfSupply();
        }

        return true;
    }

    function EndAuction() external returns (bool) {
        //  the auction
        require(
            msg.sender == creator,
            "Only the auction creator can end the auction"
        ); // Only the auction creator can End the auction
        require(
            getAuctionState() == AuctionState.OPEN,
            "can only end auction if the auction is open"
        ); // The auction must be open
        isEnded = true; // The auction has been cancelled

        nft1155.safeTransferFrom(
            address(this),
            creator,
            tokenId,
            availableNFT,
            ""
        ); // Transfer the token to the highest bidder
        availableNFT = 0;
        emit AuctionEnded(); // Emit Auction Ended event
        return true;
    }

    // Get the auction state
    function getAuctionState() public view returns (AuctionState) {
        if (availableNFT == 0) return AuctionState.OUT_OF_SUPPLY; // auction has run out of nft
        if (isEnded) return AuctionState.ENDED_BY_CREATOR; // If the auction is ended by creator
        return AuctionState.OPEN; // Otherwise return OPEN
    }

    event AuctionEnded(); // The auction was cancelled
    event OutOfSupply(); //  the contract has run out of nft
    event hasBought(address buyer, uint256 amount); // buy event
    event Refilled(uint256 amount); // the contract has received nft
}
