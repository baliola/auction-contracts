
class KEPENG {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async allowance(owner, spender) {
    const tx = await this.contractInstance.allowance(owner, spender);
    return tx;
  }

  async approve(spender, amount) {
    const tx = await this.contractInstance.approve(spender, amount);
    return tx;
  }

  async balanceOf(account) {
    const tx = await this.contractInstance.balanceOf(account);
    return tx;
  }

  async burn(amount) {
    const tx = await this.contractInstance.burn(amount);
    return tx;
  }

  async burnFrom(account, amount) {
    const tx = await this.contractInstance.burnFrom(account, amount);
    return tx;
  }

  async decimals() {
    const tx = await this.contractInstance.decimals();
    return tx;
  }

  async decreaseAllowance(spender, subtractedValue) {
    const tx = await this.contractInstance.decreaseAllowance(spender, subtractedValue);
    return tx;
  }

  async increaseAllowance(spender, addedValue) {
    const tx = await this.contractInstance.increaseAllowance(spender, addedValue);
    return tx;
  }

  async name() {
    const tx = await this.contractInstance.name();
    return tx;
  }

  async owner() {
    const tx = await this.contractInstance.owner();
    return tx;
  }

  async paused() {
    const tx = await this.contractInstance.paused();
    return tx;
  }

  async renounceOwnership() {
    const tx = await this.contractInstance.renounceOwnership();
    return tx;
  }

  async symbol() {
    const tx = await this.contractInstance.symbol();
    return tx;
  }

  async totalSupply() {
    const tx = await this.contractInstance.totalSupply();
    return tx;
  }

  async transfer(recipient, amount) {
    const tx = await this.contractInstance.transfer(recipient, amount);
    return tx;
  }

  async transferFrom(sender, recipient, amount) {
    const tx = await this.contractInstance.transferFrom(sender, recipient, amount);
    return tx;
  }

  async transferOwnership(newOwner) {
    const tx = await this.contractInstance.transferOwnership(newOwner);
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

}

module.exports = {
  KEPENG
}