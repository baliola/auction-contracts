import * as ethers from "ethers"

export default class AuctionManager {
  contractInstance
  contractAddress

  constructor(contractAddress, abi) {
    this.contractInstance = new ethers.Contract(contractAddress, abi);
    this.contractAddress = contractAddress;
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

}