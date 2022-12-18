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
  assertRange,
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
} = require("../../utils/require-errors/auction.errors");

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

contract(auctionManager1155, async (defaultAccounts) => {
  it("should create open bid auction with royalties", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const listAuction = await aManager1155.getAuctions(users[0]);

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    console.log(
      "create auction bids multiple gas used",
      createAuction.receipt.gasUsed
    );

    const listAuctionAfterCreateAuction = await aManager1155.getAuctions(
      users[0]
    );

    assert.strictEqual(
      listAuctionAfterCreateAuction.length,
      listAuction.length + 1
    );
  });

  it("should place bid nft", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);
    const allBids = await firstAuction.allBids(users[0]);
    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    console.log("place bid nft gas used", buyerBid.receipt.gasUsed);

    const allBidAfterBid = await firstAuction.allBids(users[0]);
    assert.strictEqual(allBidAfterBid[1].length, allBids[1].length + 1);
  });

  it("should withdraw funds to creator", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const creatorKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    const withdrawFunds = await firstAuction.withdrawFunds(users[0]);

    const creatorKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(creatorKPGAfterWithdraw, creatorKPG + KPGWithdrawed);

    // const withdrawToken = await _inferAuction.withdrawToken(buyer);
    // const buyerNFTApprove = await nftContract.approve(
    //   aManager1155.contractAddress,
    //   _tokenId,
    //   buyer
    // );
    // const createAuctionCollectible = await aManager1155.createAuction(
    //   endTimeAuction,
    //   false,
    //   directBuyPriceAuction,
    //   startPrice,
    //   nftContract.contractAddress,
    //   _tokenId,
    //   _nftAmount,
    //   users[0],
    //   buyer,
    //   royalty
    // );

    // const secondAuctionID = await aManager1155.getAuctions(buyer);
    // const secondAuction = await aManager1155.inferAuction(secondAuctionID[2]);
    // const secondBuyerBid = await aManager1155.placeBid(
    //   _secondAuctionID,
    //   transactionFee,
    //   secondBuyer
    // );
    // const BuyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    // console.log("buyerKPG", BuyerKPG);

    // await secondAuction.endAuctionByCreator(buyer);
    // const withdrawFundsCollectible = await secondAuction.withdrawFunds(buyer);
    // const BuyerKPGAfterWithdraw = parseInt(
    //   await kepeng.balanceOf(buyer, buyer)
    // );
    // assert.strictEqual(
    //   BuyerKPGAfterWithdraw,
    //   BuyerKPG + (KPGWithdrawed - royaltyCost)
    // );
  });

  it("should withdraw token to creator", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const buyerNFT = parseInt(
      await nftContract.balanceOf(buyer, _tokenId, buyer)
    );
    const withdrawToken = await firstAuction.withdrawToken(buyer);
    const buyerNFTAfterWithdraw = parseInt(
      await nftContract.balanceOf(buyer, _tokenId, buyer)
    );

    assert.strictEqual(buyerNFTAfterWithdraw, buyerNFT + _nftAmount);
  });

  it("should create open bid collectible auction", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const withdrawFunds = await firstAuction.withdrawFunds(users[0]);
    const withdrawToken = await firstAuction.withdrawToken(buyer);
    const buyerNFTApprove = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const listAuction = await aManager1155.getAuctions(buyer);

    const createAuctionCollectible = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const listAuctionAfterCreateCollectibleAuction =
      await aManager1155.getAuctions(buyer);

    assert.strictEqual(
      listAuctionAfterCreateCollectibleAuction.length,
      listAuction.length + 1
    );

    // const secondAuctionID = await aManager1155.getAuctions(buyer);
    // const secondAuction = await aManager1155.inferAuction(secondAuctionID[2]);
    // const secondBuyerBid = await aManager1155.placeBid(
    //   _secondAuctionID,
    //   transactionFee,
    //   secondBuyer
    // );
    // const BuyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    // console.log("buyerKPG", BuyerKPG);

    // await secondAuction.endAuctionByCreator(buyer);
    // const withdrawFundsCollectible = await secondAuction.withdrawFunds(buyer);
    // const BuyerKPGAfterWithdraw = parseInt(
    //   await kepeng.balanceOf(buyer, buyer)
    // );
    // assert.strictEqual(
    //   BuyerKPGAfterWithdraw,
    //   BuyerKPG + (KPGWithdrawed - royaltyCost)
    // );
  });

  it("should place bid NFT from collectible auction", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 18899;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const withdrawFunds = await firstAuction.withdrawFunds(users[0]);
    const withdrawToken = await firstAuction.withdrawToken(buyer);
    const buyerNFTApprove = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const secondAuctionID = await aManager1155.getAuctions(buyer);
    const secondAuction = await aManager1155.inferAuction(secondAuctionID[2]);

    const allBids = await secondAuction.allBids(buyer);

    const secondBuyerBid = await aManager1155.placeBid(
      _secondAuctionID,
      transactionFee,
      secondBuyer
    );

    const allBidsAfterBid = await secondAuction.allBids(buyer);

    assert.strictEqual(allBidsAfterBid[1].length, allBids[1].length + 1);

    // const BuyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));
    // console.log("buyerKPG", BuyerKPG);

    // await secondAuction.endAuctionByCreator(buyer);
    // const withdrawFundsCollectible = await secondAuction.withdrawFunds(buyer);
    // const BuyerKPGAfterWithdraw = parseInt(
    //   await kepeng.balanceOf(buyer, buyer)
    // );
    // assert.strictEqual(
    //   BuyerKPGAfterWithdraw,
    //   BuyerKPG + (KPGWithdrawed - royaltyCost)
    // );
  });

  it("should withdrawFunds from collectible auction", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 18899;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const withdrawFunds = await firstAuction.withdrawFunds(users[0]);
    const withdrawToken = await firstAuction.withdrawToken(buyer);
    const buyerNFTApprove = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const secondAuctionID = await aManager1155.getAuctions(buyer);
    const secondAuction = await aManager1155.inferAuction(secondAuctionID[2]);

    const secondBuyerBid = await aManager1155.placeBid(
      _secondAuctionID,
      transactionFee,
      secondBuyer
    );

    const BuyerKPG = parseInt(await kepeng.balanceOf(buyer, buyer));

    await secondAuction.endAuctionByCreator(buyer);
    const withdrawFundsCollectible = await secondAuction.withdrawFunds(buyer);
    const BuyerKPGAfterWithdraw = parseInt(
      await kepeng.balanceOf(buyer, buyer)
    );
    assert.strictEqual(
      assertRange(
        BuyerKPGAfterWithdraw,
        BuyerKPG + (KPGWithdrawed - royaltyCost),
        10
      ),
      true
    );
  });

  it("should withdraw token from collectible auction", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const withdrawFunds = await firstAuction.withdrawFunds(users[0]);
    const withdrawToken = await firstAuction.withdrawToken(buyer);
    const buyerNFTApprove = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const secondAuctionID = await aManager1155.getAuctions(buyer);
    const secondAuction = await aManager1155.inferAuction(secondAuctionID[2]);

    const secondBuyerBid = await aManager1155.placeBid(
      _secondAuctionID,
      transactionFee,
      secondBuyer
    );

    await secondAuction.endAuctionByCreator(buyer);
    const secondBuyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );

    const withdrawTokenCollectible = await secondAuction.withdrawToken(
      secondBuyer
    );

    const secondBuyerNFTAfterWithdraw = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );

    assert.strictEqual(
      secondBuyerNFTAfterWithdraw,
      secondBuyerNFT + _nftAmount
    );
  });

  it("should send royalty to creator from collectible auction", async () => {
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
    const directBuyPriceAuction = 0;
    const startPrice = 10000;
    const _tokenId = 0;
    const firstBid = 20000;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((firstBid * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + firstBid);
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    const royaltyCost = parseInt((KPGWithdrawed * royalty) / 100);
    const allowance = 1000000000;
    const transferKpg = 1000000;
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const nftContract = await contractFactory.makeDummy1155Nft();
    const mintNft = await nftContract.mint(
      users[0],
      _nftAmount,
      "0x",
      users[0]
    );
    const aManager1155 = await contractFactory.make1155AuctionManager(
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
      aManager1155.contractAddress,
      allowance,
      buyer
    );
    const increaseAllowanceSecond = await kepeng.increaseAllowance(
      aManager1155.contractAddress,
      allowance,
      secondBuyer
    );
    const _allowace = parseInt(
      await kepeng.allowance(buyer, aManager1155.contractAddress, buyer)
    );
    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[1]);

    const buyerBid = await aManager1155.placeBid(
      _auctionId,
      transactionFee,
      buyer
    );

    await firstAuction.endAuctionByCreator(users[0]);
    const withdrawFunds = await firstAuction.withdrawFunds(users[0]);
    const withdrawToken = await firstAuction.withdrawToken(buyer);
    const buyerNFTApprove = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      endTimeAuction,
      false,
      directBuyPriceAuction,
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const secondAuctionID = await aManager1155.getAuctions(buyer);
    const secondAuction = await aManager1155.inferAuction(secondAuctionID[2]);

    const secondBuyerBid = await aManager1155.placeBid(
      _secondAuctionID,
      transactionFee,
      secondBuyer
    );

    const creatorKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));

    await secondAuction.endAuctionByCreator(buyer);
    const withdrawFundsCollectible = await secondAuction.withdrawFunds(buyer);

    const creatorKPGAfterSellerWithdrawFunds = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(
      creatorKPGAfterSellerWithdrawFunds,
      creatorKPG + royaltyCost
    );
  });
});
