
class Dummy1155 {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async DEFAULT_ADMIN_ROLE() {
    const tx = await this.contractInstance.DEFAULT_ADMIN_ROLE();
    return tx;
  }

  async MINTER_ROLE() {
    const tx = await this.contractInstance.MINTER_ROLE();
    return tx;
  }

  async PAUSER_ROLE() {
    const tx = await this.contractInstance.PAUSER_ROLE();
    return tx;
  }

  async URI_SETTER_ROLE() {
    const tx = await this.contractInstance.URI_SETTER_ROLE();
    return tx;
  }

  async balanceOf(account, id) {
    const tx = await this.contractInstance.balanceOf(account, id);
    return tx;
  }

  async balanceOfBatch(accounts, ids) {
    const tx = await this.contractInstance.balanceOfBatch(accounts, ids);
    return tx;
  }

  async burn(account, id, value) {
    const tx = await this.contractInstance.burn(account, id, value);
    return tx;
  }

  async burnBatch(account, ids, values) {
    const tx = await this.contractInstance.burnBatch(account, ids, values);
    return tx;
  }

  async exists(id) {
    const tx = await this.contractInstance.exists(id);
    return tx;
  }

  async getRoleAdmin(role) {
    const tx = await this.contractInstance.getRoleAdmin(role);
    return tx;
  }

  async grantRole(role, account) {
    const tx = await this.contractInstance.grantRole(role, account);
    return tx;
  }

  async hasRole(role, account) {
    const tx = await this.contractInstance.hasRole(role, account);
    return tx;
  }

  async isApprovedForAll(account, operator) {
    const tx = await this.contractInstance.isApprovedForAll(account, operator);
    return tx;
  }

  async name() {
    const tx = await this.contractInstance.name();
    return tx;
  }

  async paused() {
    const tx = await this.contractInstance.paused();
    return tx;
  }

  async renounceRole(role, account) {
    const tx = await this.contractInstance.renounceRole(role, account);
    return tx;
  }

  async revokeRole(role, account) {
    const tx = await this.contractInstance.revokeRole(role, account);
    return tx;
  }

  async safeBatchTransferFrom(from, to, ids, amounts, data) {
    const tx = await this.contractInstance.safeBatchTransferFrom(from, to, ids, amounts, data);
    return tx;
  }

  async safeTransferFrom(from, to, id, amount, data) {
    const tx = await this.contractInstance.safeTransferFrom(from, to, id, amount, data);
    return tx;
  }

  async setApprovalForAll(operator, approved) {
    const tx = await this.contractInstance.setApprovalForAll(operator, approved);
    return tx;
  }

  async totalSupply(id) {
    const tx = await this.contractInstance.totalSupply(id);
    return tx;
  }

  async uri(argv1) {
    const tx = await this.contractInstance.uri(argv1);
    return tx;
  }

  async setURI(newuri) {
    const tx = await this.contractInstance.setURI(newuri);
    return tx;
  }

  async pause() {
    const tx = await this.contractInstance.pause();
    return tx;
  }

  async unpause() {
    const tx = await this.contractInstance.unpause();
    return tx;
  }

  async mint(account, amount, data) {
    const tx = await this.contractInstance.mint(account, amount, data);
    return tx;
  }

  async mintBatch(to, countOfNFTs, amounts, data) {
    const tx = await this.contractInstance.mintBatch(to, countOfNFTs, amounts, data);
    return tx;
  }

  async supportsInterface(interfaceId) {
    const tx = await this.contractInstance.supportsInterface(interfaceId);
    return tx;
  }

  async getCurrentTokenId() {
    const tx = await this.contractInstance.getCurrentTokenId();
    return tx;
  }

}
module.exports = {
  Dummy1155
}