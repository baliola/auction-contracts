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

  async changeManager(newManager, fromAddress) {
    const tx = await this.contractInstance.changeManager(newManager, { from: fromAddress });
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

  async placeBid(auctionId, transactionFee) {
    const tx = await this.contractInstance.placeBid(auctionId, transactionFee);
    return tx;
  }

  async createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftAmount, _nftSeller) {
    const tx = await this.contractInstance.createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftAmount, _nftSeller);
    return tx;
  }

  async getAuctions() {
    const tx = await this.contractInstance.getAuctions();
    return tx;
  }

}
module.exports = {
  FixedPriceAuctionManager1155
}