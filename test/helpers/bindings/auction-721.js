
class Auction721 {
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

  async bids(argv1, fromAddress) {
    const tx = await this.contractInstance.bids(argv1, { from: fromAddress });
    return tx;
  }

  async creator(fromAddress) {
    const tx = await this.contractInstance.creator({ from: fromAddress });
    return tx;
  }

  async royalty(fromAddress) {
    const tx = await this.contractInstance.royalty({ from: fromAddress });
    return tx;
  }

  async isRoyaltyActive(fromAddress) {
    const tx = await this.contractInstance.isRoyaltyActive({ from: fromAddress });
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

  async nftSeller(fromAddress) {
    const tx = await this.contractInstance.nftSeller({ from: fromAddress });
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

  async tokenId(fromAddress) {
    const tx = await this.contractInstance.tokenId({ from: fromAddress });
    return tx;
  }

  async onERC721Received(argv1, argv2, argv3, argv4) {
    const tx = await this.contractInstance.onERC721Received(argv1, argv2, argv3, argv4);
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
  Auction721
}