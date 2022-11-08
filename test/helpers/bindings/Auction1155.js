
class Auction1155 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async baliolaWallet() {
    const tx = await this.contractInstance.baliolaWallet();
    return tx;
  }

  async bids(argv1) {
    const tx = await this.contractInstance.bids(argv1);
    return tx;
  }

  async creator() {
    const tx = await this.contractInstance.creator();
    return tx;
  }

  async directBuyPrice() {
    const tx = await this.contractInstance.directBuyPrice();
    return tx;
  }

  async directBuyStatus() {
    const tx = await this.contractInstance.directBuyStatus();
    return tx;
  }

  async endTime() {
    const tx = await this.contractInstance.endTime();
    return tx;
  }

  async isCancelled() {
    const tx = await this.contractInstance.isCancelled();
    return tx;
  }

  async isDirectBuy() {
    const tx = await this.contractInstance.isDirectBuy();
    return tx;
  }

  async isEndedByCreator() {
    const tx = await this.contractInstance.isEndedByCreator();
    return tx;
  }

  async manager() {
    const tx = await this.contractInstance.manager();
    return tx;
  }

  async maxBid() {
    const tx = await this.contractInstance.maxBid();
    return tx;
  }

  async maxBidder() {
    const tx = await this.contractInstance.maxBidder();
    return tx;
  }

  async minIncrement() {
    const tx = await this.contractInstance.minIncrement();
    return tx;
  }

  async nftAddress() {
    const tx = await this.contractInstance.nftAddress();
    return tx;
  }

  async nftAmount() {
    const tx = await this.contractInstance.nftAmount();
    return tx;
  }

  async nftSeller() {
    const tx = await this.contractInstance.nftSeller();
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

  async startPrice() {
    const tx = await this.contractInstance.startPrice();
    return tx;
  }

  async startTime() {
    const tx = await this.contractInstance.startTime();
    return tx;
  }

  async supportsInterface(interfaceId) {
    const tx = await this.contractInstance.supportsInterface(interfaceId);
    return tx;
  }

  async tokenId() {
    const tx = await this.contractInstance.tokenId();
    return tx;
  }

  async allBids() {
    const tx = await this.contractInstance.allBids();
    return tx;
  }

  async placeBid(bidder, bidAmount) {
    const tx = await this.contractInstance.placeBid(bidder, bidAmount);
    return tx;
  }

  async withdrawToken() {
    const tx = await this.contractInstance.withdrawToken();
    return tx;
  }

  async withdrawFunds() {
    const tx = await this.contractInstance.withdrawFunds();
    return tx;
  }

  async endAuctionByCreator() {
    const tx = await this.contractInstance.endAuctionByCreator();
    return tx;
  }

  async cancelAuction() {
    const tx = await this.contractInstance.cancelAuction();
    return tx;
  }

  async getAuctionState() {
    const tx = await this.contractInstance.getAuctionState();
    return tx;
  }

}

module.exports = {
  Auction1155
}