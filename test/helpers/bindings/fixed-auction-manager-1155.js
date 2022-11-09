const { AuctionFixedPrice1155 } = require("./auction-fixed-price-1155");

class FixedPriceAuctionManager1155 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async auctionsByAddress(argv1) {
    const tx = await this.contractInstance.auctionsByAddress(argv1);
    return tx;
  }

  async auctionsByIndex(argv1) {
    const tx = await this.contractInstance.auctionsByIndex(argv1);
    return tx;
  }

  async auctionsUser(argv1, argv2) {
    const tx = await this.contractInstance.auctionsUser(argv1, argv2);
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

  async changeManager(newManager) {
    const tx = await this.contractInstance.changeManager(newManager);
    return tx;
  }

  async changeBaliolaWallet(newBaliolaWallet) {
    const tx = await this.contractInstance.changeBaliolaWallet(newBaliolaWallet);
    return tx;
  }

  async getUserAuction(user) {
    const tx = await this.contractInstance.getUserAuction(user);
    return tx;
  }

  async buy(auctionId, transactionFee, amount) {
    const tx = await this.contractInstance.buy(auctionId, transactionFee, amount);
    return tx;
  }

  async refill(auctionId, amount) {
    const tx = await this.contractInstance.refill(auctionId, amount);
    return tx;
  }

  async createAuction(price, _nftAddress, _tokenId, _nftAmount, _nftSeller) {
    const tx = await this.contractInstance.createAuction(price, _nftAddress, _tokenId, _nftAmount, _nftSeller);
    return tx;
  }

  async getAuctions() {
    const tx = await this.contractInstance.getAuctions();
    return tx;
  }
  /**
 * 
 * @param {string} address 
 * @returns {Promise<AuctionFixedPrice1155>} auction fixed price 1155 contract instance
 */
  async inferAuction(address) {
    const instance = await fixedPriceAuctionArtifact.at(address)
    const contract = new AuctionFixedPrice1155(instance)
    return contract
  }


}

module.exports = {
  FixedPriceAuctionManager1155
}