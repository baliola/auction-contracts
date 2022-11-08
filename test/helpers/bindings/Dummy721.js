class Dummy721 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async approve(to, tokenId) {
    const tx = await this.contractInstance.approve(to, tokenId);
    return tx;
  }

  async balanceOf(owner) {
    const tx = await this.contractInstance.balanceOf(owner);
    return tx;
  }

  async getApproved(tokenId) {
    const tx = await this.contractInstance.getApproved(tokenId);
    return tx;
  }

  async isApprovedForAll(owner, operator) {
    const tx = await this.contractInstance.isApprovedForAll(owner, operator);
    return tx;
  }

  async itemValue(argv1) {
    const tx = await this.contractInstance.itemValue(argv1);
    return tx;
  }

  async name() {
    const tx = await this.contractInstance.name();
    return tx;
  }

  async ownerOf(tokenId) {
    const tx = await this.contractInstance.ownerOf(tokenId);
    return tx;
  }

  async safeTransferFrom(from, to, tokenId) {
    const tx = await this.contractInstance.safeTransferFrom(from, to, tokenId);
    return tx;
  }

  async safeTransferFrom(from, to, tokenId, data) {
    const tx = await this.contractInstance.safeTransferFrom(from, to, tokenId, data);
    return tx;
  }

  async setApprovalForAll(operator, approved) {
    const tx = await this.contractInstance.setApprovalForAll(operator, approved);
    return tx;
  }

  async supportsInterface(interfaceId) {
    const tx = await this.contractInstance.supportsInterface(interfaceId);
    return tx;
  }

  async symbol() {
    const tx = await this.contractInstance.symbol();
    return tx;
  }

  async tokenURI(tokenId) {
    const tx = await this.contractInstance.tokenURI(tokenId);
    return tx;
  }

  async transferFrom(from, to, tokenId) {
    const tx = await this.contractInstance.transferFrom(from, to, tokenId);
    return tx;
  }

  async myItems() {
    const tx = await this.contractInstance.myItems();
    return tx;
  }

  async getItem() {
    const tx = await this.contractInstance.getItem();
    return tx;
  }

}

module.exports = {
  Dummy721
}