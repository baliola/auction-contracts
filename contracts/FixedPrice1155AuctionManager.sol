// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./FixedPrice1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract FixedPriceAuctionManager1155 is ERC1155Holder {
    address _kepeng;
    uint256 _auctionIdCounter = 1; // auction Id counter
    address baliola;
    address manager;
    KEPENG Kepeng;

    mapping(uint256 => AuctionFixedPrice1155) public auctionsByIndex; // auctionsByIndex
    mapping(AuctionFixedPrice1155 => uint256) public auctionsByAddress;
    mapping(address => address[]) public auctionsUser;

    modifier onlyManager() {
        require(msg.sender == manager, "only manager can call this function");
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

    function changeManager(address newManager)
        external
        onlyManager
        returns (bool)
    {
        manager = newManager;

        return true;
    }

    function changeBaliolaWallet(address newBaliolaWallet)
        external
        onlyManager
        returns (bool)
    {
        baliola = newBaliolaWallet;

        return true;
    }

    function getUserAuction(address user)
        public
        view
        returns (address[] memory auctions)
    {
        auctions = new address[](auctionsUser[user].length);

        for (uint256 i = 0; i < auctionsUser[user].length; i++) {
            auctions[i] = auctionsUser[user][i];
        }

        return auctions;
    }

    function buy(
        uint256 auctionId,
        uint256 transactionFee,
        uint256 amount
    ) external returns (bool) {
        uint256 userFee = (transactionFee * 100) / 103;
        uint256 baliolaFee = (userFee * 3) / 100;

        Kepeng.transferFrom(msg.sender, address(this), transactionFee);
        // transfer baliola fee
        Kepeng.transfer(baliola, baliolaFee);
        // transfer the bid amount to the desired auctionsByIndex based on the auction Id
        Kepeng.transfer(address(auctionsByIndex[auctionId]), userFee);
        // actually place bid on the auction
        AuctionFixedPrice1155(auctionsByIndex[auctionId]).buy(
            msg.sender,
            amount,
            userFee
        );
        return true;
    }

    function refill(uint256 auctionId, uint256 amount) external returns (bool) {
        AuctionFixedPrice1155 auction = AuctionFixedPrice1155(
            auctionsByIndex[auctionId]
        );
        uint256 tokenId = auction.tokenId();
        address nftAddress = auction.nftAddress();
        IERC1155 nftContract = IERC1155(nftAddress);

        // refill
        auction.refill(msg.sender, amount);

        nftContract.safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );

        nftContract.safeTransferFrom(
            address(this),
            address(auction),
            tokenId,
            amount,
            ""
        ); // transfer the token to the auction

        return true;
    }

    // create an auction
    function createAuction(
        uint256 price,
        address _nftAddress,
        uint256 _tokenId,
        uint256 _nftAmount,
        address _nftCreator,
        uint256 _royalty
    ) external returns (address) {
        uint256 auctionId = _auctionIdCounter; // get the current value of the counter
        _auctionIdCounter++; // increment the counter
        AuctionFixedPrice1155 auction = new AuctionFixedPrice1155(
            msg.sender,
            baliola,
            _nftAddress,
            _tokenId,
            _nftAmount,
            price,
            Kepeng,
            _nftCreator,
            _royalty
        ); // create the auction

        auctionsByIndex[auctionId] = auction; // add the auction to the map
        auctionsByAddress[auction] = auctionId;
        auctionsUser[msg.sender].push(address(auction));

        IERC1155 _nftToken = IERC1155(_nftAddress); // get the nft token
        _nftToken.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            _nftAmount,
            ""
        );

        _nftToken.safeTransferFrom(
            address(this),
            address(auction),
            _tokenId,
            _nftAmount,
            ""
        ); // transfer the token to the auction

        return address(auction);
    }

    // Return a list of all auctionsByIndex
    function getAuctions() external view returns (address[] memory _auctions) {
        _auctions = new address[](_auctionIdCounter); // create an array of size equal to the current value of the counter
        for (uint256 i = 1; i < _auctionIdCounter; i++) {
            // for each auction
            _auctions[i - 1] = address(auctionsByIndex[i]); // add the address of the auction to the array
        }
        return _auctions; // return the array
    }
}
