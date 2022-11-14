const { assert, should, use } = require("chai");
const truffleAssert = require("truffle-assertions");
const helpers = require("../helpers/truffle-time.helpers");
const {
  auctionManager721,
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

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

contract(auctionManager721, async (defaultAccounts) => {
  it("should change manager", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const newManager = users[0];

    const kepeng = await contractFactory.makeKepeng(currentManager);

    const aManager721 = await contractFactory.make721AuctionManager(
      currentManager,
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    const changeManager = await aManager721.changeManager(
      newManager,
      currentManager
    );

    // try {
    const tryChangeManager = await aManager721.changeManager(
      currentManager,
      newManager
    );

    // } catch (error) {
    //   assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    // }
  });

  it("should change baliolaWallet", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const newBaliolaWallet = users[0];

    const kepeng = await contractFactory.makeKepeng(currentManager);

    const aManager721 = await contractFactory.make721AuctionManager(
      currentManager,
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    try {
      const tryChangeBaliolaWallet = await aManager721.changeBaliolaWallet(
        newBaliolaWallet,
        baliolaWallet
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    }
  });

  it("should create timed auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const endTimeAuction = 1668150928;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );
    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const listAuction = await aManager721.getAuctions(users[0]);

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const listAuctionAfterCreateAuction = await aManager721.getAuctions(
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 1
    );
  });

  it("should get all auction from a user", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const endTimeAuction = 1668150928;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const secondTokenId = 1;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);
    const mintSecondNft = await nftContract.getItem(users[0]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const approveSecondNft = await nftContract.approve(
      aManager721.contractAddress,
      secondTokenId,
      users[0]
    );

    const listAuction = await aManager721.getUserAuction(users[0], users[0]);

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const createSecondAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      secondTokenId,
      users[0],
      users[0]
    );

    const listAuctionAfterCreateAuction = await aManager721.getUserAuction(
      users[0],
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 2
    );
  });

  it("should get all auction from all user", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const endTimeAuction = 1668150928;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const secondTokenId = 1;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);
    const mintSecondNft = await nftContract.getItem(users[1]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const approveSecondNft = await nftContract.approve(
      aManager721.contractAddress,
      secondTokenId,
      users[1]
    );

    const listAuction = await aManager721.getAuctions(users[0]);

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const createSecondAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      secondTokenId,
      users[1],
      users[1]
    );

    const listAuctionAfterCreateAuction = await aManager721.getAuctions(
      users[1]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 2
    );
  });

  it("should place bid in the auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 1668406432;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const transferKepengtoBuyer = await kepeng.transfer(
      buyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const _allowance = parseInt(
      await kepeng.allowance(buyer, aManager721.contractAddress, buyer)
    );

    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);
    const getAllBids = await _inferAuction.allBids(users[0]);

    const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

    const getAllBidsAfterFirstBid = await _inferAuction.allBids(users[0]);

    assert.strictEqual(
      getAllBidsAfterFirstBid[0].length,
      getAllBids[0].length + 1
    );
  });

  // //belum
  // it("should withdraw token to buyer", async () => {
  //   const accounts = defaultAccounts;
  //   const contractFactory = new ContractFactory();
  //   const users = getUserWallets(accounts);
  //   const baliolaWallet = getBaliolaWallet(accounts);
  //   const managerWallet = getManagerWallet(accounts);
  //   const buyer = users[1];

  //   const _auctionId = 1;
  //   const endTimeAuction = 1668150928;
  //   const directBuyPriceAuction = 0;
  //   const startPrice = 10000;
  //   const _tokenId = 0;
  //   const firstBid = 20000;
  //   const allowance = 1000000000;
  //   const transferKpg = 1000000;
  //   const kepeng = await contractFactory.makeKepeng(users[0]);
  //   const nftContract = await contractFactory.makeDummy721Nft();
  //   const mintNft = await nftContract.getItem(users[0]);

  //   const aManager721 = await contractFactory.make721AuctionManager(
  //     users[0],
  //     kepeng.contractAddress,
  //     baliolaWallet,
  //     managerWallet
  //   );

  //   const transferKepengtoBuyer = await kepeng.transfer(
  //     buyer,
  //     transferKpg,
  //     users[0]
  //   );

  //   const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

  //   const increaseAllowance = await kepeng.increaseAllowance(
  //     aManager721.contractAddress,
  //     allowance,
  //     buyer
  //   );

  //   const _allowance = parseInt(
  //     await kepeng.allowance(buyer, aManager721.contractAddress, buyer)
  //   );

  //   const approveNft = await nftContract.approve(
  //     aManager721.contractAddress,
  //     _tokenId,
  //     users[0]
  //   );

  //   const createAuction = await aManager721.createAuction(
  //     endTimeAuction,
  //     false,
  //     directBuyPriceAuction,
  //     startPrice,
  //     nftContract.contractAddress,
  //     _tokenId,
  //     users[0],
  //     users[0]
  //   );

  //   const auctionID = await aManager721.getAuctions(users[0]);

  //   const _inferAuction = await aManager721.inferAuction(auctionID[1]);

  //   const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

  //   const buyerKPGAfterBid = parseInt(await kepeng.balanceOf(buyer, buyer));
  // });

  it("error test for timed auction : endtime > must be greater than 12 hours", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const endTimeAuction = 86400;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );
    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const listAuction = await aManager721.getAuctions(users[0]);

    try {
      const createAuction = await aManager721.createAuction(
        endTimeAuction,
        false,
        directBuyPriceAuction,
        startPrice,
        nftContract.contractAddress,
        _tokenId,
        users[0],
        users[0]
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_MANAGER_ERRORS.DIRECT_BUY_PRICE_MUST_NOT_BE_0
      );
    }
  });

  it("error test for bidding : the creator cant bid", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 1668150928;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const transferKepengtoBuyer = await kepeng.transfer(
      buyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      users[0]
    );

    const _allowance = parseInt(
      await kepeng.allowance(users[0], aManager721.contractAddress, users[0])
    );

    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);
    const getAllBids = await _inferAuction.allBids(users[0]);

    try {
      const creatorBid = await aManager721.placeBid(
        _auctionId,
        firstBid,
        users[0]
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_AUCTION_ERRORS.CREATOR_CANT_BID);
      console.log("error", error.reason);
    }
  });

  it("error test for bidding : bid must be higher than start price", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 0;
    const endTimeAuction = 86400;
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 10000;
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy721Nft();
    const mintNft = await nftContract.getItem(users[0]);

    const aManager721 = await contractFactory.make721AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const transferKepengtoBuyer = await kepeng.transfer(
      buyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const _allowance = parseInt(
      await kepeng.allowance(buyer, aManager721.contractAddress, buyer)
    );

    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    // try {
    //   const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);
    // } catch (error) {
    //   assert.strictEqual(
    //     error.reason,
    //     COMMON_AUCTION_ERRORS.BID_MUST_BE_HIGHER_THAN_START_PRICE
    //   );
    // }
  });
});
