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
const { TimeHelper } = require("../helpers/truffle-time.helpers");
const {
  COMMON_AUCTION_ERRORS,
} = require("../../utils/require-errors/common/common-auction.errors");
const {
  COMMON_MANAGER_ERRORS,
} = require("../../utils/require-errors/common/common-auction-manager.errors");
const {
  SPECIAL_AUCTION_1155_ERRORS,
} = require("../../utils/require-errors/auction.errors");

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

  it("should create timed auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000;
    const buyerKepeng = 1000000;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _tokenId = 0;
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );
    await kepeng.allowance(users[0], aManager1155.contractAddress, users[0]);
    await kepeng.allowance(buyer, aManager1155.contractAddress, buyer);
    await kepeng.allowance(
      secondBuyer,
      aManager1155.contractAddress,
      secondBuyer
    );

    const listAuction = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const listAuctionAfterCreateAuction = await aManager1155.getAuctions(
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 1
    );
  });

  it("should get all auction from a user", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const nftForFirstAuction = 5;
    const nftForSecondAuction = 5;
    const allowance = 1000000;
    const buyerKepeng = 1000000;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _tokenId = 0;
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );
    await kepeng.allowance(users[0], aManager1155.contractAddress, users[0]);
    await kepeng.allowance(buyer, aManager1155.contractAddress, buyer);
    await kepeng.allowance(
      secondBuyer,
      aManager1155.contractAddress,
      secondBuyer
    );

    const listAuction = await aManager1155.getUserAuction(users[0], users[0]);

    const auction1155 = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftForFirstAuction,
      users[0],
      users[0]
    );

    const secondAuction1155 = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftForSecondAuction,
      users[0],
      users[0]
    );

    const listAuctionAfterCreateAuction = await aManager1155.getUserAuction(
      users[0],
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 2
    );
  });

  it("should get all auction from all user", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const nftForFirstAuction = 10;
    const nftForSecondAuction = 10;
    const allowance = 1000000;
    const buyerKepeng = 1000000;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const mintSecondNft = await nftContract.mint(buyer, nftAmount, "0x", buyer);
    const _secondTokenId = 1;
    const _tokenId = 0;

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    await kepeng.allowance(users[0], aManager1155.contractAddress, users[0]);
    await kepeng.allowance(buyer, aManager1155.contractAddress, buyer);
    await kepeng.allowance(
      secondBuyer,
      aManager1155.contractAddress,
      secondBuyer
    );
    const listAuction = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const secondAuction1155 = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _secondTokenId,
      nftAmount,
      buyer,
      buyer
    );

    const listAuctionAfterCreateAuction = await aManager1155.getAuctions(
      buyer,
      buyer
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 2
    );
  });

  it("should place bid in the auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const allBids = await auction1155.allBids(users[0]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    const allBidsAfterBid = await auction1155.allBids(users[0]);

    assert.strictEqual(allBidsAfterBid[1].length, allBids[1].length + 1);
  });

  it("should get all the bids from an auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const allBids = await auction1155.allBids(users[0]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    const allBidsAfterBid = await auction1155.allBids(users[0]);

    assert.strictEqual(allBidsAfterBid[1].length, allBids[1].length + 2);
  });

  it("should withdraw token to buyer after end auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    const buyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );
    await auction1155.endAuctionByCreator(users[0]);
    const withdrawToken = await auction1155.withdrawToken(secondBuyer);
    const buyerNFTAfterWithdraw = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );

    assert.strictEqual(buyerNFTAfterWithdraw, buyerNFT + 10);
  });

  it("should withdraw kepeng to seller after end auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;
    const kepengToBuyer = 30000;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));
    await auction1155.endAuctionByCreator(users[0]);

    const withdrawFunds = await auction1155.withdrawFunds(users[0]);
    const sellerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(sellerKPGAfterWithdraw, sellerKPG + kepengToBuyer);
  });

  //error
  it("error test for timed auction : endtime must be greater than 12 hours", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000;
    const buyerKepeng = 1000000;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _tokenId = 0;
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );
    await kepeng.allowance(users[0], aManager1155.contractAddress, users[0]);
    await kepeng.allowance(buyer, aManager1155.contractAddress, buyer);
    await kepeng.allowance(
      secondBuyer,
      aManager1155.contractAddress,
      secondBuyer
    );

    const listAuction = await aManager1155.getAuctions(users[0]);

    try {
      const auction1155 = await aManager1155.createAuction(
        endTimeAuction,
        false,
        directBuyPriceAuction,
        startPrice,
        nftContract.contractAddress,
        _tokenId,
        nftAmount,
        users[0],
        users[0]
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_MANAGER_ERRORS.END_TIME_MUST_BE_GREATER_THAN_12_HOURS
      );
    }
  });

  it("error test for bidding : creator cant bid", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const allBids = await auction1155.allBids(users[0]);

    try {
      const placeBid = await aManager1155.placeBid(
        _auctionId,
        transactionFee,
        users[0]
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_AUCTION_ERRORS.CREATOR_CANT_BID);
    }
  });

  it("error test for bidding : can only place bid when auction is open (cancel)", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const cancelAuction = await auction1155.cancelAuction(users[0]);

    try {
      const placeBid = await aManager1155.placeBid(
        _auctionId,
        transactionFee,
        buyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.AUCTION_MUST_BE_OPEN
      );
    }
  });

  it("error test for bidding : can only place bid when auction is open (ended)", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await auction1155.endAuctionByCreator(users[0]);

    try {
      const secondPlaceBid = await aManager1155.placeBid(
        _auctionId,
        secondTransactionFee,
        secondBuyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.AUCTION_MUST_BE_OPEN
      );
    }
  });

  it("error test for bidding : bid must be higher than start price", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const allBids = await auction1155.allBids(users[0]);

    try {
      const placeBid = await aManager1155.placeBid(
        _auctionId,
        startPrice,
        buyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.BID_MUST_BE_HIGHER_THAN_START_PRICE
      );
    }
  });

  it("error test for bidding : bid must be higher than current bid + minimum increment", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const allBids = await auction1155.allBids(users[0]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    try {
      const placeBid = await aManager1155.placeBid(
        _auctionId,
        25000,
        secondBuyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT_AND_START_PRICE
      );
    }
  });

  it("error test for bidding : bid must be higher than current bid + minimum increment", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 5000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);
    const _token = parseInt(await nftContract.balanceOf(users[0], 0, users[0]));

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const allBids = await auction1155.allBids(users[0]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    try {
      const placeBid = await aManager1155.placeBid(_auctionId, 8000, buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT
      );
    }
  });

  it("error test for withdraw token : auction must be ended by either a direct buy or timeout", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    const buyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );
    try {
      const withdrawToken = await auction1155.withdrawToken(secondBuyer);
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_AUCTION_ERRORS.AUCTION_MUST_END);
    }
  });

  it("error test for withdraw funds : auction must be ended by either a direct buy, by creator or timeout", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    try {
      const withdrawFunds = await auction1155.withdrawFunds(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_AUCTION_1155_ERRORS.AUCTION_MUST_END_1155
      );
    }
  });

  it("error test for withdraw token : the highest bidder can only withdraw token", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    await auction1155.endAuctionByCreator(users[0]);
    try {
      const withdrawToken = await auction1155.withdrawToken(buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_MAX_BIDDER_CAN_WITHDRAW_TOKEN
      );
    }
  });

  it("error test for withdraw funds : the auction creator can only withdraw funds", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    await auction1155.endAuctionByCreator(users[0]);
    try {
      const withdrawFunds = await auction1155.withdrawFunds(buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_CREATOR_CAN_WITHDRAW_FUNDS
      );
    }
  });

  it("error test for end auction : can only end auction when its open", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    await auction1155.endAuctionByCreator(users[0]);
    try {
      await auction1155.endAuctionByCreator(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.CAN_ONLY_END_AUCTION_IF_OPEN
      );
    }
  });

  it("error test for end auction : only the creator can end auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    try {
      await auction1155.endAuctionByCreator(buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_CREATOR_CAN_END_AUCTION
      );
    }
  });

  it("error test for cancel auction : only the creator can cancel auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    try {
      await auction1155.cancelAuction(buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_CREATOR_CAN_CANCEL_AUCTION
      );
    }
  });

  it("error test for cancel auction : only the creator can cancel auction", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    await auction1155.cancelAuction(users[0]);
    try {
      await auction1155.cancelAuction(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.CAN_ONLY_CANCEL_AUCTION_IF_OPEN
      );
    }
  });

  it("should withdraw token to buyer after timeout", async () => {
    const contractFactory = new ContractFactory();
    const timeHelper = new TimeHelper();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 86400);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    const buyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );

    await timeHelper.advanceTimeAndBlock(86400);
    const withdrawToken = await auction1155.withdrawToken(secondBuyer);
    const buyerNFTAfterWithdraw = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );

    assert.strictEqual(buyerNFTAfterWithdraw, buyerNFT + 10);
  });

  it("should withdraw kepeng to seller after timeout", async () => {
    const contractFactory = new ContractFactory();
    const timeHelper = new TimeHelper();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const users = getUserWallets(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _tokenId = 0;

    const _auctionId = 1;

    const dateEndtime = Date.now() / 1000;
    const endTimeAuction = parseInt(dateEndtime + 172800);
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const nftAmount = 10;
    const allowance = 1000000000;
    const buyerKepeng = 1000000;

    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const secondTransactionFee = 30900;
    const kepengToBuyer = 30000;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const buyerKPG = await kepeng.transfer(buyer, buyerKepeng, users[0]);
    const secondBuyerKPG = await kepeng.transfer(
      secondBuyer,
      buyerKepeng,
      users[0]
    );

    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    const aManager1155 = await contractFactory.make1155AuctionManager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      users[0]
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      nftAmount,
      users[0],
      users[0]
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const auction1155 = await aManager1155.inferAuction(auctionId[1]);

    const placeBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );
    const placeSecondBid = await aManager1155.placeBid(
      _auctionId,
      secondTransactionFee,
      secondBuyer
    );

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));
    await auction1155.endAuctionByCreator(users[0]);

    await timeHelper.advanceTimeAndBlock(172800);
    const withdrawFunds = await auction1155.withdrawFunds(users[0]);
    const sellerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );
    assert.strictEqual(sellerKPGAfterWithdraw, sellerKPG + kepengToBuyer);
  });
});
