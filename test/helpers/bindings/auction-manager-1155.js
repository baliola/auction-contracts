const { auction1155Artifact } = require("../../../utils/utils");
const { Auction1155 } = require("./auction-1155");

class AuctionManager1155 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async auctionsByAddress(argv1, fromAddress
  ) {
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

  async onERC1155BatchReceived(argv1, argv2, argv3, argv4, argv5) {
    const tx = await this.contractInstance.onERC1155BatchReceived(argv1, argv2, argv3, argv4, argv5);
    return tx;
  }

  async onERC1155Received(argv1, argv2, argv3, argv4, argv5) {
    const tx = await this.contractInstance.onERC1155Received(argv1, argv2, argv3, argv4, argv5);
    return tx;
  }

  async supportsInterface(interfaceId) {
    const tx = await this.contractInstance.supportsInterface(interfaceId);
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

  async getUserAuction(user, fromAddress) {
    const tx = await this.contractInstance.getUserAuction(user, { from: fromAddress });
    return tx;
  }

  async placeBid(auctionId, transactionFee, fromAddress) {
    const tx = await this.contractInstance.placeBid(auctionId, transactionFee, { from: fromAddress });
    return tx;
  }


  async createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftAmount, _nftSeller, fromAddress, _royalty = 0) {
    const tx = await this.contractInstance.createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftAmount, _nftSeller, _royalty, { from: fromAddress });
    return tx;
  }

  async getAuctions(fromAddress) {
    const tx = await this.contractInstance.getAuctions({ from: fromAddress });
    return tx;
  }

  /**
   * 
   * @param {string} address 
   * @returns {Promise<Auction1155>} auction 1155 contract instance
   */
  async inferAuction(address) {
    const instance = await auction1155Artifact.at(address)
    const contract = new Auction1155(instance)

    return contract
  }


}

module.exports = {
  AuctionManager1155
}