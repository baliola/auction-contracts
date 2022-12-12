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
const { int } = require("smartcontract-type-binding-generator");

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

contract(auctionManager721, async (defaultAccounts) => {
  it("should create fixed price auction with royalties", async () => {
    const accounts = defaultAccounts;
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
    const royalty = 5;
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

    const transferKepengToBuyer = await kepeng.transfer(
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

    const _allowace = parseInt(
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
      users[0],
      royalty
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

  it("should create fixed price auction with royalties", async () => {
    const accounts = defaultAccounts;
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
    const royalty = 5;
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

    const transferKepengToBuyer = await kepeng.transfer(
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

    const _allowace = parseInt(
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
      users[0],
      royalty
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

  it("should buy nft from buyer and withdraw funds from creator", async () => {
    const accounts = defaultAccounts;
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
    const royalty = 5;
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

    const transferKepengToBuyer = await kepeng.transfer(
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

    const _allowace = parseInt(
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
      users[0],
      royalty
    );

    const auctionId = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionId[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    const withdrawFunds = await _inferAuction.withdrawFunds(users[0]);

    const sellerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    console.log("beforeWihtdraw", sellerKPG);
    console.log("afterWithdraw", sellerKPGAfterWithdraw);

    assert.strictEqual(sellerKPGAfterWithdraw, sellerKPG + firstBid);
  });

  it("should buy nft from buyer and withdraw funds from creator", async () => {
    const accounts = defaultAccounts;
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
    const royalty = 5;
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

    const transferKepengToBuyer = await kepeng.transfer(
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

    const _allowace = parseInt(
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
      users[0],
      royalty
    );

    const auctionId = await aManager721.getAuctions(users[0]);

    const _inferAuction = await aManager721.inferAuction(auctionId[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    const withdrawFunds = await _inferAuction.withdrawFunds(users[0]);

    const sellerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(sellerKPGAfterWithdraw, sellerKPG + firstBid);
  });

  it("should be buyer sell their collected nft", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];

    const _auctionId = 1;
    const _secondAuctionID = 2;
    const endTimeAuction = 0;
    const directBuyPriceAuction = 20600;
    const startPrice = 0;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
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

    const transferKepengToBuyer = await kepeng.transfer(
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

    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager721.contractAddress,
      allowance,
      secondBuyer
    );

    const _allowace = parseInt(
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
      users[0],
      royalty
    );

    const auctionId = await aManager721.getAuctions(users[0]);

    console.log("first auction id", auctionId);

    const _inferAuction = await aManager721.inferAuction(auctionId[1]);

    const buyerBid = await aManager721.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    const sellerKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    const withdrawFunds = await _inferAuction.withdrawFunds(users[0]);

    const withdrawToken = await _inferAuction.withdrawToken(buyer);

    const buyerNFTApprove = await nftContract.approve(
      aManager721.contractAddress,
      _tokenId,
      buyer
    );
    const createAuctionCollectible = await aManager721.createAuction(
      endTimeAuction,
      true,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      users[0],
      buyer,
      5
    );

    const secondAuctionID = await aManager721.getAuctions(buyer);
    const secondAuction = await aManager721.inferAuction(secondAuctionID[2]);

    const creatorKPGBeforeBuyerSoldNFT = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );
    const buyerKPGBeforeSoldNFT = parseInt(
      await kepeng.balanceOf(buyer, buyer)
    );
    const secondBuyerKPG = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    console.log("creatorkpgbeforesold", creatorKPGBeforeBuyerSoldNFT);
    console.log("buyerkpgbeforesold", buyerKPGBeforeSoldNFT);
    console.log("secondbuyerkpg", secondBuyerKPG);

    const secondBuyerBid = await aManager721.placeBid(
      _secondAuctionID,
      transactionFee,
      secondBuyer
    );

    const secondBuyerWithdrawToken = await secondAuction.withdrawToken(
      secondBuyer
    );
    const secondBuyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, secondBuyer)
    );

    console.log("secondbuyernft", secondBuyerNFT);

    const buyerWithdrawFunds = await secondAuction.withdrawFunds(buyer);

    const creatorKPGAfterBuyerSoldNFT = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );
    const buyerKPGAfterSoldNFT = parseInt(await kepeng.balanceOf(buyer, buyer));
    const secondBuyerKPGAfterBid = parseInt(
      await kepeng.balanceOf(secondBuyer, secondBuyer)
    );

    console.log("creatorkpgaftersold", creatorKPGAfterBuyerSoldNFT);
    console.log("buyerkpgaftersold", buyerKPGAfterSoldNFT);
    console.log("secondbuyerkpgafterbid", secondBuyerKPGAfterBid);
  });
});
