
class KEPENG {
  contractInstance
  contractAddress

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async allowance(owner, spender, fromAddress) {
    const tx = await this.contractInstance.allowance(owner, spender, { from: fromAddress });
    return tx;
  }

  async approve(spender, amount, fromAddress) {
    const tx = await this.contractInstance.approve(spender, amount, { from: fromAddress });
    return tx;
  }

  async balanceOf(account, fromAddress) {
    const tx = await this.contractInstance.balanceOf(account, { from: fromAddress });
    return tx;
  }

  async burn(amount, fromAddress) {
    const tx = await this.contractInstance.burn(amount, { from: fromAddress });
    return tx;
  }

  async burnFrom(account, amount, fromAddress) {
    const tx = await this.contractInstance.burnFrom(account, amount, { from: fromAddress });
    return tx;
  }

  async decimals() {
    const tx = await this.contractInstance.decimals();
    return tx;
  }

  async decreaseAllowance(spender, subtractedValue, fromAddress) {
    const tx = await this.contractInstance.decreaseAllowance(spender, subtractedValue, { from: fromAddress });
    return tx;
  }

  async increaseAllowance(spender, addedValue, fromAddress) {
    const tx = await this.contractInstance.increaseAllowance(spender, addedValue, { from: fromAddress });
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

  async renounceOwnership(fromAddress) {
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

  async transfer(recipient, amount, fromAddress) {
    const tx = await this.contractInstance.transfer(recipient, amount, { from: fromAddress });
    return tx;
  }

  async transferFrom(sender, recipient, amount, fromAddress) {
    const tx = await this.contractInstance.transferFrom(sender, recipient, amount, { from: fromAddress });
    return tx;
  }

  async transferOwnership(newOwner, fromAddress) {
    const tx = await this.contractInstance.transferOwnership(newOwner, { from: fromAddress });
    return tx;
  }

  async pause(fromAddress) {
    const tx = await this.contractInstance.pause({ from: fromAddress });
    return tx;
  }

  async unpause(fromAddress) {
    const tx = await this.contractInstance.unpause({ from: fromAddress });
    return tx;
  }

}

module.exports = {
  KEPENG
}