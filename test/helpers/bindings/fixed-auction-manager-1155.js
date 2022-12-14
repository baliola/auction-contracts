const { fixedPriceAuctionArtifact } = require("../../../utils/utils");
const { AuctionFixedPrice1155 } = require("./auction-fixed-price-1155");

class FixedPriceAuctionManager1155 {
  contractInstance;
  contractAddress;

  constructor(contract) {
    this.contractInstance = contract;
    this.contractAddress = contract.address;
  }

  async auctionsByAddress(argv1, fromAddress) {
    const tx = await this.contractInstance.auctionsByAddress(argv1, {
      from: fromAddress,
    });
    return tx;
  }

  async auctionsByIndex(argv1, fromAddress) {
    const tx = await this.contractInstance.auctionsByIndex(argv1, {
      from: fromAddress,
    });
    return tx;
  }

  async auctionsUser(argv1, argv2, fromAddress) {
    const tx = await this.contractInstance.auctionsUser(argv1, argv2, {
      from: fromAddress,
    });
    return tx;
  }

  async onERC1155BatchReceived(argv1, argv2, argv3, argv4, argv5) {
    const tx = await this.contractInstance.onERC1155BatchReceived(
      argv1,
      argv2,
      argv3,
      argv4,
      argv5
    );
    return tx;
  }

  async onERC1155Received(argv1, argv2, argv3, argv4, argv5) {
    const tx = await this.contractInstance.onERC1155Received(
      argv1,
      argv2,
      argv3,
      argv4,
      argv5
    );
    return tx;
  }

  async supportsInterface(interfaceId) {
    const tx = await this.contractInstance.supportsInterface(interfaceId);
    return tx;
  }

  async changeManager(newManager, fromAddress) {
    const tx = await this.contractInstance.changeManager(newManager, {
      from: fromAddress,
    });
    return tx;
  }

  async changeBaliolaWallet(newBaliolaWallet, fromAddress) {
    const tx = await this.contractInstance.changeBaliolaWallet(
      newBaliolaWallet,
      { from: fromAddress }
    );
    return tx;
  }

  async getUserAuction(user, fromAddress) {
    const tx = await this.contractInstance.getUserAuction(user, {
      from: fromAddress,
    });
    return tx;
  }

  async buy(auctionId, transactionFee, amount, fromAddress) {
    const tx = await this.contractInstance.buy(
      auctionId,
      transactionFee,
      amount,
      { from: fromAddress }
    );
    return tx;
  }

  async refill(auctionId, amount, fromAddress) {
    const tx = await this.contractInstance.refill(auctionId, amount, {
      from: fromAddress,
    });
    return tx;
  }

  async createAuction(
    price,
    _nftAddress,
    _tokenId,
    _nftAmount,
    _nftSeller,
    fromAddress
  ) {
    const tx = await this.contractInstance.createAuction(
      price,
      _nftAddress,
      _tokenId,
      _nftAmount,
      _nftSeller,
      { from: fromAddress }
    );
    return tx;
  }

  async getAuctions(fromAddress) {
    const tx = await this.contractInstance.getAuctions({ from: fromAddress });
    return tx;
  }
  /**
   *
   * @param {string} address
   * @returns {Promise<AuctionFixedPrice1155>} auction fixed price 1155 contract instance
   */
  async inferAuction(address) {
    const instance = await fixedPriceAuctionArtifact.at(address);
    const contract = new AuctionFixedPrice1155(instance);
    return contract;
  }
}

module.exports = {
  FixedPriceAuctionManager1155,
};
