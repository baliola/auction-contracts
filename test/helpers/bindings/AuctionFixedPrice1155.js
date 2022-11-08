import * as ethers from "ethers"

export default class AuctionFixedPrice1155 {
  contractInstance
  contractAddress

  constructor(contractAddress, abi) {
    this.contractInstance = new ethers.Contract(contractAddress, abi);
    this.contractAddress = contractAddress;
  }

  async availableNFT() {
    const tx = await this.contractInstance.availableNFT();
    return tx;
  }

  async baliolaWallet() {
    const tx = await this.contractInstance.baliolaWallet();
    return tx;
  }

  async buyers(argv1) {
    const tx = await this.contractInstance.buyers(argv1);
    return tx;
  }

  async creator() {
    const tx = await this.contractInstance.creator();
    return tx;
  }

  async index() {
    const tx = await this.contractInstance.index();
    return tx;
  }

  async initialNftAmount() {
    const tx = await this.contractInstance.initialNftAmount();
    return tx;
  }

  async isEnded() {
    const tx = await this.contractInstance.isEnded();
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

  async nftAddress() {
    const tx = await this.contractInstance.nftAddress();
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

  async price() {
    const tx = await this.contractInstance.price();
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

  async GetAllBuyers() {
    const tx = await this.contractInstance.GetAllBuyers();
    return tx;
  }

  async refill(_creator, amount) {
    const tx = await this.contractInstance.refill(_creator, amount);
    return tx;
  }

  async buy(_buyer, _amount, txFee) {
    const tx = await this.contractInstance.buy(_buyer, _amount, txFee);
    return tx;
  }

  async EndAuction() {
    const tx = await this.contractInstance.EndAuction();
    return tx;
  }

  async getAuctionState() {
    const tx = await this.contractInstance.getAuctionState();
    return tx;
  }

}