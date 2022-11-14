const { assert, should, use } = require("chai");
const truffleAssert = require("truffle-assertions");
const helpers = require("../helpers/truffle-time.helpers");
const {
  auctionManager1155,
  getManagerWallet,
  getUserWallets,
  getDeployedContracts,
  auctionManager721Artifact,
  nft1155,
  nft1155Artifact,
  getDeployerWallet,
  kepengDecimals,
  defaultNftTokenId,
  kepengArtifact,
  getBaliolaWallet,
} = require("../../utils/utils");
const { AuctionHelper } = require("../helpers/auction.helpers");
const { transferKepengFromDeployer } = require("../helpers/kepeng.helpers");
const { balanceOf1155 } = require("../helpers/nft1155.helpers");
const { ContractFactory } = require("../helpers/factory.helpers");
const {
  COMMON_AUCTION_ERRORS,
} = require("../../utils/require-errors/common/common-auction.errors");
const {
  COMMON_MANAGER_ERRORS,
} = require("../../utils/require-errors/common/common-auction-manager.errors");
const {
  SPECIAL_AUCTION_1155_ERRORS,
} = require("../../utils/require-errors/auction-1155.errors");

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

contract(auctionManager1155, async (defaultAccounts) => {
  it("should change manager", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    const changeManager = await aManager1155.changeManager(
      users[0],
      currentManager
    );

    try {
      const tryChangeManager = await aManager1155.changeManager(
        users[1],
        currentManager
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    }
  });

  it("should change baliola wallet", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    const changeBaliolaWallet = await aManager1155.changeBaliolaWallet(
      users[0],
      currentManager
    );

    try {
      const tryChangeBaliolaWallet = await aManager1155.changeBaliolaWallet(
        users[1],
        users[3]
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    }
  });

  // it("should create auction", async () => {
  //   const contractFactory = new ContractFactory();
  //   const accounts = defaultAccounts;
  //   const currentManager = getManagerWallet(accounts);
  //   const baliolaWallet = getBaliolaWallet(accounts);
  //   const users = getUserWallets(accounts);
  //   const buyer = users[1];
  //   const secondBuyer = users[2];

  //   const buyerKepeng = 1000000;
  //   const startPrice = 10000;
  //   const nftAmount = 5;
  //   const allowance = 1000000;

  //   const kepeng = await contractFactory.makeKepeng(users[0]);
  //   await kepeng.transfer(buyer, buyerKepeng, users[0]);
  //   await kepeng.transfer(secondBuyer, buyerKepeng, users[0]);

  //   console.log("first", parseInt(await kepeng.balanceOf(buyer, users[0])));
  //   console.log(
  //     "second",
  //     parseInt(await kepeng.balanceOf(secondBuyer, users[0]))
  //   );

  //   const nftToken = await contractFactory.makeDummy1155Nft(users[0]);
  //   await nftToken.mint(users[0], nftAmount, "0x", users[0]);
  //   const _tokenId = 0;

  //   const aManager1155 = await contractFactory.make1155AuctionManager(
  //     users[0],
  //     kepeng.contractAddress,
  //     baliolaWallet,
  //     currentManager
  //   );

  //   await nftToken.setApprovalForAll(
  //     aManager1155.contractAddress,
  //     true,
  //     users[0]
  //   );
  //   await kepeng.increaseAllowance(
  //     aManager1155.contractAddress,
  //     allowance,
  //     users[0]
  //   );
  //   await kepeng.increaseAllowance(
  //     aManager1155.contractAddress,
  //     allowance,
  //     buyer
  //   );
  //   await kepeng.increaseAllowance(
  //     aManager1155.contractAddress,
  //     allowance,
  //     secondBuyer
  //   );

  //   const getAuctionsList = await aManager1155.getUserAuction(
  //     users[0],
  //     users[0]
  //   );

  //   const auction1155 = await aManager1155.createAuction(
  //     startPrice,
  //     nftToken,
  //     _tokenId,
  //     nftAmount,
  //     users[0],
  //     users[0]
  //   );

  //   const getAuctionsListAfterCreateAuction = await aManager1155.getUserAuction(
  //     users[0],
  //     users[0]
  //   );

  //   assert.strictEqual(
  //     getAuctionsListAfterCreateAuction.length,
  //     getAuctionsList.length
  //   );
  // });
});
