// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Auction.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract AuctionManager {
    address _kepeng;
    uint256 _auctionIdCounter = 1 ; // auction Id counter
    address baliola;
    KEPENG Kepeng;
    address manager;

    mapping(uint256 => Auction) public auctionsByIndex; // auctionsByIndex
    mapping(Auction => uint256) public auctionsByAddress;
    mapping(address => address[])public auctionsUser;

   modifier onlyManager(){
    require(msg.sender == manager,"only manager can call this function");
    _;
   }

    constructor(
        address _kepeng_sc,
        address _baliola,
        address _manager
    ) {
        _kepeng = _kepeng_sc;
        Kepeng = KEPENG(_kepeng);
        baliola = _baliola;
        manager = _manager;
    }

    function getUserAuction(address user)public view returns(address[] memory auctions){
        auctions = new address[](auctionsUser[user].length);

        for (uint256 i = 0; i < auctionsUser[user].length;i++){
            auctions[i] = auctionsUser[user][i];
        }

        return auctions;
    }

    
    function changeManager(address newManager) external onlyManager returns(bool) {
        manager = newManager;

        return true;
    }

    
    function changeBaliolaWallet(address newBaliolaWallet) external onlyManager returns(bool) {
        baliola = newBaliolaWallet;

        return true;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function placeBid(
        uint256 auctionId,
        uint256 transactionFee
    ) external returns (bool) {
        Kepeng.transferFrom(msg.sender, address(this), transactionFee);
        // transfer the bid amount to the desired auctionsByIndex based on the auction Id
        Kepeng.transfer(address(auctionsByIndex[auctionId]), transactionFee);
        // transfer the fee back to baliola's wallet
        // actually place bid on the auction
        Auction(auctionsByIndex[auctionId]).placeBid(msg.sender, transactionFee);
        return true;
    }

    // create an auction
    function createAuction(
        uint256 _endTime,
        bool _directBuyAuction,
        uint256 _directBuyPrice,
        uint256 _startPrice,
        address _nftAddress,
        uint256 _tokenId,
        address _nftSeller
    ) external returns (address) {
        
        if (_directBuyAuction) {
            require(
                _directBuyPrice > 0,
                "direct buy price must be greater than 0"
            ); // direct buy price must be greater than 0
            require(
                _startPrice < _directBuyPrice,
                "start price must be less than the direct buy price"
            ); // start price must be less than the direct buy price

            if(_endTime != 0){
            require(
                _endTime > 12 hours,
                "must be greater than 12 hours"
            );

        }

            uint256 auctionId = _auctionIdCounter; // get the current value of the counter
            _auctionIdCounter++; // increment the counter
            Auction auction = new Auction(
                msg.sender,
                _endTime,
                baliola,
                _directBuyAuction,
                _directBuyPrice,
                _startPrice,
                _nftAddress,
                _tokenId,
                Kepeng,
                _nftSeller
            ); // create the auction
                IERC721 _nftToken = IERC721(_nftAddress); // get the nft token
                _nftToken.transferFrom(msg.sender, address(auction), _tokenId); // transfer the token to the auction
                auctionsByIndex[auctionId] = auction; // add the auction to the map
                auctionsByAddress[auction] = auctionId;
                auctionsUser[msg.sender].push(address(auction));

                

                return address(auction);
        } else {
            if(_endTime != 0){
            require(
                _endTime > 12 hours,
                "must be greater than 12 hours"
            );
            
        }
            uint256 auctionId = _auctionIdCounter; // get the current value of the counter
            _auctionIdCounter++; // increment the counter
            Auction auction = new Auction(
                msg.sender,
                _endTime,
                baliola,
                _directBuyAuction,
                _directBuyPrice,
                _startPrice,
                _nftAddress,
                _tokenId,
                Kepeng,
                _nftSeller
            ); // create the auction
                IERC721 _nftToken = IERC721(_nftAddress); // get the nft token
                _nftToken.transferFrom(msg.sender, address(auction), _tokenId); // transfer the token to the auction
                auctionsByIndex[auctionId] = auction; // add the auction to the map
                auctionsByAddress[auction] = auctionId;                
                auctionsUser[msg.sender].push(address(auction));


                return address(auction);
                
        }
    }

    // Return a list of all auctionsByIndex
    function getAuctions() external view returns (address[] memory _auctions) {
        _auctions = new address[](_auctionIdCounter); // create an array of size equal to the current value of the counter
        for (uint256 i = 0; i < _auctionIdCounter; i++) {
            // for each auction
            _auctions[i] = address(auctionsByIndex[i]); // add the address of the auction to the array
        }
        return _auctions; // return the array
    }

   

}