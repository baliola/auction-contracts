const { auction721Artifact } = require("../../../utils/utils");
const { Auction721 } = require("./auction-721");

class AuctionManager721 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async auctionsByAddress(argv1, fromAddress) {
    const tx = await this.contractInstance.auctionsByAddress(argv1, { from: fromAddress });
    return tx;
  }

  async auctionsByIndex(argv1, fromAddress) {
    const tx = await this.contractInstance.auctionsByIndex(argv1, { from: fromAddress });
    return tx;
  }

  async auctionsUser(argv1, argv2, fromAddress) {
    const tx = await this.contractInstance.auctionsUser(argv1, argv2, { from: fromAddress });
    return tx;
  }

  async getUserAuction(user, fromAddress) {
    const tx = await this.contractInstance.getUserAuction(user, { from: fromAddress });
    return tx;
  }

  async changeManager(newManager, fromAddress) {
    const tx = await this.contractInstance.changeManager(newManager, { from: fromAddress });
    return tx;
  }

  async changeBaliolaWallet(newBaliolaWallet, fromAddress) {
    const tx = await this.contractInstance.changeBaliolaWallet(newBaliolaWallet, { from: fromAddress });
    return tx;
  }

  async onERC721Received(argv1, argv2, argv3, argv4) {
    const tx = await this.contractInstance.onERC721Received(argv1, argv2, argv3, argv4);
    return tx;
  }

  async placeBid(auctionId, transactionFee, fromAddress) {
    const tx = await this.contractInstance.placeBid(auctionId, transactionFee, { from: fromAddress });
    return tx;
  }

  async createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftSeller, fromAddress) {
    const tx = await this.contractInstance.createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftSeller, { from: fromAddress });
    return tx;
  }

  async getAuctions(fromAddress) {
    const tx = await this.contractInstance.getAuctions({ from: fromAddress });
    return tx;
  }

  /**
   * 
   * @param {string} address 
   * @returns {Promise<Auction721>} auction 721 contract instance
   */
  async inferAuction(address) {
    const instance = await auction721Artifact.at(address)
    const contract = new Auction721(instance)

    return contract
  }

}

module.exports = {
  AuctionManager721
}