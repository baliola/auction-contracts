const { fixedPriceAuctionArtifact } = require("../../../utils/utils");

class AuctionFixedPrice1155 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async availableNFT(fromAddress) {
    const tx = await this.contractInstance.availableNFT({ from: fromAddress });
    return tx;
  }

  async baliolaWallet(fromAddress) {
    const tx = await this.contractInstance.baliolaWallet({ from: fromAddress });
    return tx;
  }

  async buyers(argv1) {
    const tx = await this.contractInstance.buyers(argv1);
    return tx;
  }

  async creator(fromAddress) {
    const tx = await this.contractInstance.creator({ from: fromAddress });
    return tx;
  }

  async index(fromAddress) {
    const tx = await this.contractInstance.index({ from: fromAddress });
    return tx;
  }

  async initialNftAmount(fromAddress) {
    const tx = await this.contractInstance.initialNftAmount({ from: fromAddress });
    return tx;
  }

  async isEnded(fromAddress) {
    const tx = await this.contractInstance.isEnded({ from: fromAddress });
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

  async nftAddress(fromAddress) {
    const tx = await this.contractInstance.nftAddress({ from: fromAddress });
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

  async price(fromAddress) {
    const tx = await this.contractInstance.price({ from: fromAddress });
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

  async GetAllBuyers(fromAddress) {
    const tx = await this.contractInstance.GetAllBuyers({ from: fromAddress });
    return tx;
  }

  async refill(_creator, amount, fromAddress) {
    const tx = await this.contractInstance.refill(_creator, amount, { from: fromAddress });
    return tx;
  }

  async buy(_buyer, _amount, txFee, fromAddress) {
    const tx = await this.contractInstance.buy(_buyer, _amount, txFee, { from: fromAddress });
    return tx;
  }

  async EndAuction(fromAddress) {
    const tx = await this.contractInstance.EndAuction({ from: fromAddress });
    return tx;
  }

  async getAuctionState(fromAddress) {
    const tx = await this.contractInstance.getAuctionState({ from: fromAddress });
    return tx;
  }

}

module.exports = {
  AuctionFixedPrice1155
}