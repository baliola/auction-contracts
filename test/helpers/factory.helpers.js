const {
  auction721Artifact,
  auction1155Artifact,
  auctionManager721Artifact,
  auctionManager1155Artifact,
  nft721Artifact,
  nft1155Artifact,
  fixedPriceAuction,
  fixedPriceAuctionArtifact,
  fixedPriceAuctionManagerArtifact,
  kepengArtifact,
} = require("../../utils/utils");
const { Auction1155 } = require("./bindings/auction-1155");
const { Auction721 } = require("./bindings/auction-721");
const {
  AuctionFixedPrice1155,
} = require("./bindings/auction-fixed-price-1155");
const { AuctionManager1155 } = require("./bindings/auction-manager-1155");
const { AuctionManager721 } = require("./bindings/auction-manager-721");
const { Dummy1155 } = require("./bindings/dummy-1155");
const { Dummy721 } = require("./bindings/dummy-721");
const {
  FixedPriceAuctionManager1155,
} = require("./bindings/fixed-auction-manager-1155");
const { KEPENG } = require("./bindings/KEPENG");

class ContractFactory {
  /**
   * this is a low level api for deploying new auction contract, you might not need this
   *
   * @param {string} deployerAddress
   * @param {string} creator
   * @param {number} endTime
   * @param {string} baliolaWallet
   * @param {boolean} directBuyStatus
   * @param {number} directBuyPrice
   * @param {number} startPrice
   * @param {string} nftContractAddress
   * @param {number} nftTokenId
   * @param {any} kepengContractInstance
   * @param {string} nftSellerAddress
   * @returns {Promise<Auction721>} fixed price 1155 manager instance auction 721 contract instance
   */
  async make721Auction(
    deployerAddress,
    creator,
    endTime,
    baliolaWallet,
    directBuyStatus,
    directBuyPrice,
    startPrice,
    nftContractAddress,
    nftTokenId,
    kepengContractInstance,
    nftSellerAddress
  ) {
    const contract = await auction721Artifact.new(
      creator,
      endTime,
      baliolaWallet,
      directBuyStatus,
      directBuyPrice,
      startPrice,
      nftContractAddress,
      nftTokenId,
      kepengContractInstance,
      nftSellerAddress,
      { from: deployerAddress }
    );

    return new Auction721(contract);
  }
  /**
   *
   * this is a low level api for deploying new auction contract, you might not need this
   *
   * @param {string} deployerAddress
   * @param {string} creator
   * @param {number} endtime
   * @param {string} baliolaWallet
   * @param {boolean} directBuyStatus
   * @param {number} directBuyPrice
   * @param {number} startPrice
   * @param {string} nftContractAddress
   * @param {number} nftTokenId
   * @param {number} nftAmount
   * @param {any} kepengContractInstance
   * @param {string} nftSellerAddress
   * @returns {Promise<Auction1155>} fixed price 1155 manager instance auction 1155 contract instance
   */
  async make1155Auction(
    deployerAddress,
    creator,
    endtime,
    baliolaWallet,
    directBuyStatus,
    directBuyPrice,
    startPrice,
    nftContractAddress,
    nftTokenId,
    nftAmount,
    kepengContractInstance,
    nftSellerAddress
  ) {
    const contract = await auction1155Artifact.new(
      deployerAddress,
      creator,
      endtime,
      baliolaWallet,
      directBuyStatus,
      directBuyPrice,
      startPrice,
      nftContractAddress,
      nftTokenId,
      nftAmount,
      kepengContractInstance,
      nftSellerAddress,
      { from: deployerAddress }
    );

    return new Auction1155(contract);
  }
  /**
   *
   * @param {string} deployerAddress
   * @param {string} kepengSmartContractAddress
   * @param {string} baliolaWallet
   * @param {string} managerAddress
   * @returns {Promise<AuctionManager721>} fixed price 1155 manager instance auction 721 manager instance
   */
  async make721AuctionManager(
    deployerAddress,
    kepengSmartContractAddress,
    baliolaWallet,
    managerAddress
  ) {
    const contract = await auctionManager721Artifact.new(
      kepengSmartContractAddress,
      baliolaWallet,
      managerAddress,
      { from: deployerAddress }
    );

    return new AuctionManager721(contract);
  }
  /**
   *
   * @param {string} deployerAddress
   * @param {string} kepengSmartContractAddress
   * @param {string} baliolaWallet
   * @param {string} managerAddress
   * @returns {Promise<AuctionManager1155>} fixed price 1155 manager instance auction 1155 manager instance
   */
  async make1155AuctionManager(
    deployerAddress,
    kepengSmartContractAddress,
    baliolaWallet,
    managerAddress
  ) {
    const contract = await auctionManager1155Artifact.new(
      kepengSmartContractAddress,
      baliolaWallet,
      managerAddress,
      { from: deployerAddress }
    );

    return new AuctionManager1155(contract);
  }

  /**
   *
   * @returns {Promise<Dummy721>} fixed price 1155 manager instance dummy nft 721 contract instance
   */
  async makeDummy721Nft() {
    const contract = await nft721Artifact.new();

    return new Dummy721(contract);
  }

  /**
   *
   * @param {string} deployerAddress
   * @returns {Promise<Dummy1155>} fixed price 1155 manager instance dummy nft 1155 contract instance
   */
  async makeDummy1155Nft(deployerAddress) {
    const contract = await nft1155Artifact.new({ from: deployerAddress });

    return new Dummy1155(contract);
  }

  /**
   *
   * this is a low level api for deploying new auction contract, you might not need this
   *
   * @param {string} deployerAddress
   * @param {string} creator
   * @param {string} baliolaWallet
   * @param {string} nftContractAddress
   * @param {number} tokenId
   * @param {number} nftAmount
   * @param {number} price
   * @param {any} kepengContractInstance
   * @param {string} nftSellerAddress
   * @returns {Promise<AuctionFixedPrice1155>} fixed price 1155 manager instance fixed price 1155 contract instance
   */
  async makeFixedPrice1155(
    deployerAddress,
    creator,
    baliolaWallet,
    nftContractAddress,
    tokenId,
    nftAmount,
    price,
    kepengContractInstance,
    nftSellerAddress
  ) {
    const contract = await fixedPriceAuctionArtifact.new(
      creator,
      baliolaWallet,
      nftContractAddress,
      tokenId,
      nftAmount,
      price,
      kepengContractInstance,
      nftSellerAddress,
      { from: deployerAddress }
    );

    return new AuctionFixedPrice1155(contract);
  }
  /**
   * @param {string} deployerAddress
   * @param {string} kepengSmartContractAddress
   * @param {string} baliolaWallet
   * @param {string} managerAddress
   * @returns  {Promise<FixedPriceAuctionManager1155>} fixed price 1155 manager instance
   */
  async makeFixedPrice1155Manager(
    deployerAddress,
    kepengSmartContractAddress,
    baliolaWallet,
    managerAddress
  ) {
    const contract = await fixedPriceAuctionManagerArtifact.new(
      kepengSmartContractAddress,
      baliolaWallet,
      managerAddress,
      { from: deployerAddress }
    );

    return new FixedPriceAuctionManager1155(contract);
  }
  /**
   * @param {string} fromAddress value to be used `msg.sender`
   * @returns {Promise<KEPENG>} fixed price 1155 manager instance kepeng contract instance
   */
  async makeKepeng(fromAddress) {
    const contract = await kepengArtifact.new({ from: fromAddress });

    return new KEPENG(contract);
  }
}

module.exports = {
  ContractFactory,
};
