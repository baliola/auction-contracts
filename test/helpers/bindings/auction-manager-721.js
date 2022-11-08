
class AuctionManager721 {
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

  async getUserAuction(user) {
    const tx = await this.contractInstance.getUserAuction(user);
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

  async onERC721Received(argv1, argv2, argv3, argv4) {
    const tx = await this.contractInstance.onERC721Received(argv1, argv2, argv3, argv4);
    return tx;
  }

  async placeBid(auctionId, transactionFee) {
    const tx = await this.contractInstance.placeBid(auctionId, transactionFee);
    return tx;
  }

  async createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftSeller) {
    const tx = await this.contractInstance.createAuction(_endTime, _directBuyAuction, _directBuyPrice, _startPrice, _nftAddress, _tokenId, _nftSeller);
    return tx;
  }

  async getAuctions() {
    const tx = await this.contractInstance.getAuctions();
    return tx;
  }

}

module.exports = {
  AuctionManager721
}