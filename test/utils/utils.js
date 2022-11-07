const auction721 = artifacts.require("Auction721");
const auction1155 = artifacts.require("Auction1155");
const auctionManager721 = artifacts.require("AuctionManager721");
const auctionManager1155 = artifacts.require("AuctionManager1155");
const nft721 = artifacts.require("Dummy721");
const nft1155 = artifacts.require("Dummy1155");
const fixedPriceAuction = artifacts.require("AuctionFixedPrice1155");
const fixedPriceAuctionManager = artifacts.require("FixedPriceAuctionManager1155");
const kepeng = artifacts.require("KEPENG");

async function deploy(contract) {
    const contract = await contract.deployed();

    return contract
}

export {
    auction721,
    auction1155,
    auctionManager721,
    auctionManager1155,
    nft721,
    nft1155,
    fixedPriceAuctionManager,
    fixedPriceAuction,
    kepeng,
    deploy
}
