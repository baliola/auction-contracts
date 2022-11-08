import * as ethers from "ethers"

export default class KEPENG {
  private contractInstance: ethers.Contract
  private contractAddress: string

  constructor(contractAddress: string, abi: any) {
    this.contractInstance = new ethers.Contract(contractAddress,abi);
    this.contractAddress = contractAddress;
  }

  public async allowance (owner: string, spender: string) : Promise<number>  {
    const tx = await this.contractInstance.allowance(owner,spender);
    return tx;
  }

  public async approve (spender: string, amount: number) : Promise<any> {
    const tx = await this.contractInstance.approve(spender,amount);
    return tx;
  }

  public async balanceOf (account: string) : Promise<number>  {
    const tx = await this.contractInstance.balanceOf(account);
    return tx;
  }

  public async burn (amount: number) : Promise<any> {
    const tx = await this.contractInstance.burn(amount);
    return tx;
  }

  public async burnFrom (account: string, amount: number) : Promise<any> {
    const tx = await this.contractInstance.burnFrom(account,amount);
    return tx;
  }

  public async decimals(): Promise<number>  {
    const tx = await this.contractInstance.decimals();
    return tx;
  }

  public async decreaseAllowance (spender: string, subtractedValue: number) : Promise<any> {
    const tx = await this.contractInstance.decreaseAllowance(spender,subtractedValue);
    return tx;
  }

  public async increaseAllowance (spender: string, addedValue: number) : Promise<any> {
    const tx = await this.contractInstance.increaseAllowance(spender,addedValue);
    return tx;
  }

  public async name(): Promise<string>  {
    const tx = await this.contractInstance.name();
    return tx;
  }

  public async owner(): Promise<string>  {
    const tx = await this.contractInstance.owner();
    return tx;
  }

  public async paused(): Promise<boolean>  {
    const tx = await this.contractInstance.paused();
    return tx;
  }

  public async renounceOwnership(): Promise<any> {
    const tx = await this.contractInstance.renounceOwnership();
    return tx;
  }

  public async symbol(): Promise<string>  {
    const tx = await this.contractInstance.symbol();
    return tx;
  }

  public async totalSupply(): Promise<number>  {
    const tx = await this.contractInstance.totalSupply();
    return tx;
  }

  public async transfer (recipient: string, amount: number) : Promise<any> {
    const tx = await this.contractInstance.transfer(recipient,amount);
    return tx;
  }

  public async transferFrom (sender: string, recipient: string, amount: number) : Promise<any> {
    const tx = await this.contractInstance.transferFrom(sender,recipient,amount);
    return tx;
  }

  public async transferOwnership (newOwner: string) : Promise<any> {
    const tx = await this.contractInstance.transferOwnership(newOwner);
    return tx;
  }

  public async pause(): Promise<any> {
    const tx = await this.contractInstance.pause();
    return tx;
  }

  public async unpause(): Promise<any> {
    const tx = await this.contractInstance.unpause();
    return tx;
  }

}