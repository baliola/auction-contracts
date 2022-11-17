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

    try {
      const tryChangeManager = await aManager721.changeManager(
        currentManager,
        newManager
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    }
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

  it("should create fixed price auction", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
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

    const listAuction = await aManager721.getUserAuction(users[0], users[0]);

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const listAuctionAfterCreateAuction = await aManager721.getUserAuction(
      users[0],
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 1
    );
  });

  it("should get all auction from all user", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const createSecondAuction = await aManager721.createAuction(
      endTimeAuction,
      true,
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

  it("should get all auction from a user", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
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

    const listAuctionAfterCreateAuction = await aManager721.getUserAuction(
      users[0],
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 1
    );
  });

  it("should place bid in the auction", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 40000;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);
    const allBidsBeforeBid = await _inferAuction.allBids(users[[0]]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    const getAuctionState = await _inferAuction.getAuctionState(users[0]);

    const allBidsAfterBid = await _inferAuction.allBids(users[0]);

    assert.strictEqual(
      allBidsAfterBid[1].length,
      allBidsBeforeBid[1].length + 1
    );
  });

  it("should get all bids from an auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 10000;
    const _tokenId = 0;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      0,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const allBidsBeforeBid = await _inferAuction.allBids(users[0]);

    const buyerBid = await aManager721.placeBid(_auctionId, startPrice, buyer);

    const secondBuyerBid = await aManager721.placeBid(
      _auctionId,
      26000,
      secondBuyer
    );

    const allBids = await _inferAuction.allBids(users[0]);

    assert.strictEqual(allBids[1].length, allBidsBeforeBid[1].length + 2);
  });

  it("should withdraw token to the highest bidder(ended)", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const firstBid = 20000;
    const startPrice = 10000;
    const _tokenId = 0;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      0,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, startPrice, buyer);

    const secondBuyerBid = await aManager721.placeBid(
      _auctionId,
      firstBid,
      secondBuyer
    );

    const endAuction = await _inferAuction.endAuctionByCreator(users[0]);

    const allBids = await _inferAuction.allBids(users[0]);

    const buyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, secondBuyer)
    );

    const withdrawToken = await _inferAuction.withdrawToken(secondBuyer);

    const buyerNFTAfterWithdraw = parseInt(
      await nftContract.balanceOf(secondBuyer, secondBuyer)
    );

    assert.strictEqual(buyerNFTAfterWithdraw, buyerNFT + 1);
  });

  it("should withdraw token to the highest bidder(direct buy)", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 10000;
    const _tokenId = 0;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      0,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, startPrice, buyer);

    const secondBuyerBid = await aManager721.placeBid(
      _auctionId,
      26000,
      secondBuyer
    );

    const allBids = await _inferAuction.allBids(users[0]);

    const buyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, secondBuyer)
    );

    const withdrawToken = await _inferAuction.withdrawToken(secondBuyer);

    const buyerNFTAfterWithdraw = parseInt(
      await nftContract.balanceOf(secondBuyer, secondBuyer)
    );

    assert.strictEqual(buyerNFTAfterWithdraw, buyerNFT + 1);
  });

  it("should withdraw kepeng to the seller(direct buy)", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
    const firstBid = 10000;
    const secondBid = 20000;
    const kepengPersentage = (secondBid * 3) / 100;
    const transactionFee = kepengPersentage + secondBid;
    const _tokenId = 0;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

    const secondBuyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      secondBuyer
    );

    const allBids = await _inferAuction.allBids(users[0]);

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    const withdrawFunds = await _inferAuction.withdrawFunds(users[0]);

    const sellerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(sellerKPGAfterWithdraw, sellerKPG + secondBid);
  });

  it("should withdraw kepeng to the seller(ended)", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 30000;
    const startPrice = 0;
    const firstBid = 10000;
    const secondBid = 20000;
    const _tokenId = 0;
    const kepengPersentage = (secondBid * 3) / 100;
    const transactionFee = kepengPersentage + secondBid;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

    const secondBuyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      secondBuyer
    );

    await _inferAuction.endAuctionByCreator(users[0]);

    const allBids = await _inferAuction.allBids(users[0]);

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    const withdrawFunds = await _inferAuction.withdrawFunds(users[0]);

    const sellerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(sellerKPGAfterWithdraw, sellerKPG + secondBid);
  });

  it("test error for create auction : direct buy price must be greater than 0", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
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

    const listAuction = await aManager721.getUserAuction(users[0], users[0]);
    try {
      const createAuction = await aManager721.createAuction(
        endTimeAuction,
        true,
        0,
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

  it("test error for create auction : start price must be less than direct buy price", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 25000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
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

    const listAuction = await aManager721.getUserAuction(users[0], users[0]);
    try {
      const createAuction = await aManager721.createAuction(
        endTimeAuction,
        true,
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
        COMMON_MANAGER_ERRORS.START_PRICE_MUST_BE_LESS_THAN_DIRECT_BUY_PRICE
      );
    }
  });

  it("test error for bidding : the creator cant bid", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
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
      await kepeng.allowance(buyer, aManager721.contractAddress, buyer)
    );

    const approveNft = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      users[0]
    );

    const createAuction = await aManager721.createAuction(
      endTimeAuction,
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    try {
      const buyerBid = await aManager721.placeBid(
        _auctionId,
        firstBid,
        users[0]
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_AUCTION_ERRORS.CREATOR_CANT_BID);
    }
  });

  it("error test for bidding : can only place bid if the auction is open(cancel)", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
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

    const cancelAuction = await _inferAuction.cancelAuction(users[0]);

    try {
      const buyerBid = await aManager721.placeBid(
        _auctionId,
        directBuyPriceAuction,
        buyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.AUCTION_MUST_BE_OPEN
      );
    }
  });

  it("error test for bidding : can only place bid if the auction is open(end)", async () => {
    const accounts = defaultAccounts;
    const timeHelper = new TimeHelper();
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
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

    const endAuction = await _inferAuction.endAuctionByCreator(users[0]);

    try {
      const buyerBid = await aManager721.placeBid(
        _auctionId,
        directBuyPriceAuction,
        buyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.AUCTION_MUST_BE_OPEN
      );
    }
  });

  it("error test for bidding : can onnly place bid if the auction is open (directbuy)", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const secondBid = 30000;
    const startPrice = 10000;
    const _tokenId = 0;
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

    const transferKepengtoSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      0,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const allBidsBeforeBid = await _inferAuction.allBids(users[0]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      directBuyPriceAuction,
      buyer
    );

    try {
      const secondBuyerBid = await aManager721.placeBid(
        _auctionId,
        secondBid,
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
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 15000;
    const kepengAmount = (firstBid * 3) / 100;
    const transactionFee = kepengAmount + firstBid;
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    try {
      const buyerBid = await aManager721.placeBid(
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

  it("error test for bidding : bid must be higher than minimum increment", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 50000;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    try {
      const buyerSecondBid = await aManager721.placeBid(
        _auctionId,
        transactionFeeSecond,
        buyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT
      );
    }
  });

  it("error test for bidding : bid must be higher than the current bid + minimum increment", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 50000;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 25000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    const allBid1 = await _inferAuction.allBids(users[0]);

    try {
      const buyerSecondBid = await aManager721.placeBid(
        _auctionId,
        firstBid,
        secondBuyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.BID_MUST_BE_HIGHER_THAN_MININUM_INCREMENT_AND_START_PRICE
      );
    }
  });

  it("error test for withdraw token : auction must be ended by either a direct buy or timeout", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

    try {
      const withdrawToken = await _inferAuction.withdrawToken(buyer);
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_AUCTION_ERRORS.AUCTION_MUST_END);
    }
  });

  it("error test for withdraw token : the highest bidder can only withdraw tokens", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    try {
      const withdrawToken = await _inferAuction.withdrawToken(users[2]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_MAX_BIDDER_CAN_WITHDRAW_TOKEN
      );
    }
  });

  it("error test for withdraw funds : auction must be ended by either a direct buy or timeout", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 30000;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    try {
      const withdrawFunds = await _inferAuction.withdrawFunds(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_AUCTION_1155_ERRORS.AUCTION_MUST_END_1155
      );
    }
  });

  it("error test for withdraw funds : the auction creator can only withdraw funds", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    try {
      const withdrawFunds = await _inferAuction.withdrawFunds(users[2]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_CREATOR_CAN_WITHDRAW_FUNDS
      );
    }
  });

  it("error test for end auction : only creator can end the auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

    const isAuctionOpen = await _inferAuction.getAuctionState(users[0]);

    try {
      const endAuction = await _inferAuction.endAuctionByCreator(buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_CREATOR_CAN_END_AUCTION
      );
    }
  });

  it("error test for end auction : can only end auction when its open", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    const buyerBid = await aManager721.placeBid(_auctionId, firstBid, buyer);

    const endTheAuction = await _inferAuction.endAuctionByCreator(users[0]);

    try {
      const endAuctionTwice = await _inferAuction.endAuctionByCreator(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.CAN_ONLY_END_AUCTION_IF_OPEN
      );
    }
  });

  it("error test for end auction : only the creator can cancel auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      users[0]
    );

    const auctionID = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionID[1]);

    try {
      const cancel = await _inferAuction.cancelAuction(users[2]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.ONLY_CREATOR_CAN_CANCEL_AUCTION
      );
    }
  });

  it("error test for cancel auction : can only cancel auction if its open", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 5000;
    const _tokenId = 0;
    const firstBid = 20000;
    const kepengPersentage = (firstBid * 3) / 100;
    const transactionFee = kepengPersentage + firstBid;
    const transactionFeeSecond = 8000;
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

    const transferKepengToSecondBuyer = await kepeng.transfer(
      secondBuyer,
      transferKpg,
      users[0]
    );

    const buyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    const increaseAllowance = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      buyer
    );

    const increaseAllowanceSecondBuyer = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
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

    await _inferAuction.cancelAuction(users[0]);

    try {
      const cancelAuction = await _inferAuction.cancelAuction(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        COMMON_AUCTION_ERRORS.CAN_ONLY_CANCEL_AUCTION_IF_OPEN
      );
    }
  });
});
