
class Auction1155 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async baliolaWallet(fromAddress) {
    const tx = await this.contractInstance.baliolaWallet({ from: fromAddress });
    return tx;
  }

  async bids(argv1) {
    const tx = await this.contractInstance.bids(argv1);
    return tx;
  }

  async creator(fromAddress) {
    const tx = await this.contractInstance.creator({ from: fromAddress });
    return tx;
  }

  async directBuyPrice(fromAddress) {
    const tx = await this.contractInstance.directBuyPrice({ from: fromAddress });
    return tx;
  }

  async directBuyStatus(fromAddress) {
    const tx = await this.contractInstance.directBuyStatus({ from: fromAddress });
    return tx;
  }

  async endTime(fromAddress) {
    const tx = await this.contractInstance.endTime({ from: fromAddress });
    return tx;
  }

  async isCancelled(fromAddress) {
    const tx = await this.contractInstance.isCancelled({ from: fromAddress });
    return tx;
  }

  async isDirectBuy(fromAddress) {
    const tx = await this.contractInstance.isDirectBuy({ from: fromAddress });
    return tx;
  }

  async isEndedByCreator(fromAddress) {
    const tx = await this.contractInstance.isEndedByCreator({ from: fromAddress });
    return tx;
  }

  async manager(fromAddress) {
    const tx = await this.contractInstance.manager({ from: fromAddress });
    return tx;
  }

  async maxBid(fromAddress) {
    const tx = await this.contractInstance.maxBid({ from: fromAddress });
    return tx;
  }

  async maxBidder(fromAddress) {
    const tx = await this.contractInstance.maxBidder({ from: fromAddress });
    return tx;
  }

  async minIncrement(fromAddress) {
    const tx = await this.contractInstance.minIncrement({ from: fromAddress });
    return tx;
  }

  async nftAddress(fromAddress) {
    const tx = await this.contractInstance.nftAddress({ from: fromAddress });
    return tx;
  }

  async nftAmount(fromAddress) {
    const tx = await this.contractInstance.nftAmount({ from: fromAddress });
    return tx;
  }

  async nftSeller(fromAddress) {
    const tx = await this.contractInstance.nftSeller({ from: fromAddress });
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

  async startPrice(fromAddress) {
    const tx = await this.contractInstance.startPrice({ from: fromAddress });
    return tx;
  }

  async startTime(fromAddress) {
    const tx = await this.contractInstance.startTime({ from: fromAddress });
    return tx;
  }

  async supportsInterface(interfaceId) {
    const tx = await this.contractInstance.supportsInterface(interfaceId);
    return tx;
  }

  async tokenId(fromAddress) {
    const tx = await this.contractInstance.tokenId({ from: fromAddress });
    return tx;
  }

  async allBids(fromAddress) {
    const tx = await this.contractInstance.allBids({ from: fromAddress });
    return tx;
  }

  async placeBid(bidder, bidAmount, fromAddress) {
    const tx = await this.contractInstance.placeBid(bidder, bidAmount, { from: fromAddress });
    return tx;
  }

  async withdrawToken(fromAddress) {
    const tx = await this.contractInstance.withdrawToken({ from: fromAddress });
    return tx;
  }

  async withdrawFunds(fromAddress) {
    const tx = await this.contractInstance.withdrawFunds({ from: fromAddress });
    return tx;
  }

  async endAuctionByCreator(fromAddress) {
    const tx = await this.contractInstance.endAuctionByCreator({ from: fromAddress });
    return tx;
  }

  async cancelAuction(fromAddress) {
    const tx = await this.contractInstance.cancelAuction({ from: fromAddress });
    return tx;
  }

  async getAuctionState(fromAddress) {
    const tx = await this.contractInstance.getAuctionState({ from: fromAddress });
    return tx;
  }

}

module.exports = {
  Auction1155
}