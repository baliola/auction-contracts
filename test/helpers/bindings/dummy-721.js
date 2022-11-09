class Dummy721 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async approve(to, tokenId, fromAddress) {
    const tx = await this.contractInstance.approve(to, tokenId, { from: fromAddress });
    return tx;
  }

  async balanceOf(owner, fromAddress) {
    const tx = await this.contractInstance.balanceOf(owner, { from: fromAddress });
    return tx;
  }

  async getApproved(tokenId, fromAddress) {
    const tx = await this.contractInstance.getApproved(tokenId, { from: fromAddress });
    return tx;
  }

  async isApprovedForAll(owner, operator, fromAddress) {
    const tx = await this.contractInstance.isApprovedForAll(owner, operator, { from: fromAddress });
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

  async ownerOf(tokenId, fromAddress) {
    const tx = await this.contractInstance.ownerOf(tokenId, { from: fromAddress });
    return tx;
  }

  async safeTransferFrom(from, to, tokenId, fromAddress) {
    const tx = await this.contractInstance.safeTransferFrom(from, to, tokenId, { from: fromAddress });
    return tx;
  }

  async safeTransferFrom(from, to, tokenId, data, fromAddress) {
    const tx = await this.contractInstance.safeTransferFrom(from, to, tokenId, data, { from: fromAddress });
    return tx;
  }

  async setApprovalForAll(operator, approved, fromAddress) {
    const tx = await this.contractInstance.setApprovalForAll(operator, approved, { from: fromAddress });
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

  async transferFrom(from, to, tokenId, fromAddress) {
    const tx = await this.contractInstance.transferFrom(from, to, tokenId, { from: fromAddress });
    return tx;
  }

  async myItems() {
    const tx = await this.contractInstance.myItems();
    return tx;
  }

  async getItem(fromAddress) {
    const tx = await this.contractInstance.getItem({ from: fromAddress });
    return tx;
  }

}

module.exports = {
  Dummy721
}