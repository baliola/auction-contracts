const { assert, should, use } = require("chai");
const truffleAssert = require("truffle-assertions");
const helpers = require("../helpers/truffle-time.helpers");
const {
  fixedPriceAuctionManager,
  getManagerWallet,
  getUserWallets,
  getDeployedContracts,
  fixedPriceAuctionManagerArtifact,
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
  SPECIAL_FIXED_PRICE_AUCTION_ERRORS,
} = require("../../utils/require-errors/auction-fixed-price.errors");
const { int } = require("smartcontract-type-binding-generator");
const { create } = require("ts-node");

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

contract(fixedPriceAuctionManager, async (defaultAccounts) => {
  it("should create auction with royalties", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + startPrice * _nftAmount);
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    console.log(
      "create fix price multiple auction gasUse",
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

  it("should buy nft", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + startPrice * _nftAmount);
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[0]);

    const availableNFT = parseInt(await firstAuction.availableNFT(users[0]));

    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );

    console.log("buy nft gas used", buyerBid.receipt.gasUsed);

    const availableNFTAfterSold = parseInt(
      await firstAuction.availableNFT(users[0])
    );

    assert.strictEqual(availableNFTAfterSold, availableNFT - _nftAmount);
  });

  it("should automatically receive nft after buying", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    const transactionFee = parseInt(kepengPersentage + startPrice * _nftAmount);
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[0]);

    const buyerNFT = parseInt(
      await nftContract.balanceOf(buyer, _tokenId, buyer)
    );
    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );
    const buyerNFTAfterBuy = parseInt(
      await nftContract.balanceOf(buyer, _tokenId, buyer)
    );

    assert.strictEqual(buyerNFTAfterBuy, buyerNFT + _nftAmount);
  });

  it("should automatically receive kpg after selling", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    //1500
    const transactionFee = parseInt(startPrice * _nftAmount + kepengPersentage);
    //51500
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    //50000
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[0]);

    const creatorKPG = parseInt(await kepeng.balanceOf(users[0], users[0]));
    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );
    const creatorKPGAfterSell = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(creatorKPGAfterSell, creatorKPG + KPGWithdrawed);
  });

  it("should create collectible auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    //1500
    const transactionFee = parseInt(startPrice * _nftAmount + kepengPersentage);
    //51500
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    //50000
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const auctionID = await aManager1155.getAuctions(users[0]);
    const firstAuction = await aManager1155.inferAuction(auctionID[0]);

    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );

    const approveBuyerNFT = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const listAuction = await aManager1155.getAuctions(users[0]);
    const createAuctionCollectible = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );
    const listAuctionAfterCreateCollectibleAuction =
      await aManager1155.getAuctions(users[0]);

    assert.strictEqual(
      listAuctionAfterCreateCollectibleAuction.length,
      listAuction.length + 1
    );
  });

  it("should buy nft from collectible auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    //1500
    const transactionFee = parseInt(startPrice * _nftAmount + kepengPersentage);
    //51500
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    //50000
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );

    const approveBuyerNFT = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const auctionId = await aManager1155.getAuctions(users[0]);
    const secondAuctionID = await aManager1155.inferAuction(auctionId[1]);

    const availableNFT = parseInt(await secondAuctionID.availableNFT(buyer));
    const secondBuyerBid = await aManager1155.buy(
      _secondAuctionID,
      transactionFee,
      _nftAmount,
      secondBuyer
    );
    const availableNFTAfterSold = parseInt(
      await secondAuctionID.availableNFT(buyer)
    );

    assert.strictEqual(availableNFTAfterSold, availableNFT - _nftAmount);
  });

  it("should automatically receive nft after buying from collectible auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    //1500
    const transactionFee = parseInt(startPrice * _nftAmount + kepengPersentage);
    //51500
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    //50000
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );

    const approveBuyerNFT = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      buyer,
      royalty
    );

    const auctionId = await aManager1155.getAuctions(users[0]);
    const secondAuctionID = await aManager1155.inferAuction(auctionId[1]);

    const secondBuyerNFT = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );
    const secondBuyerBid = await aManager1155.buy(
      _secondAuctionID,
      transactionFee,
      _nftAmount,
      secondBuyer
    );
    const secondBuyerNFTAfterBuy = parseInt(
      await nftContract.balanceOf(secondBuyer, _tokenId, secondBuyer)
    );

    assert.strictEqual(secondBuyerNFTAfterBuy, secondBuyerNFT + _nftAmount);
  });

  it("should automatically receive kpg after selling from collectible auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    //1500
    const transactionFee = parseInt(startPrice * _nftAmount + kepengPersentage);
    //51500
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    //50000
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const creatorKPG = await kepeng.balanceOf(users[0], users[0]);

    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );

    const approveBuyerNFT = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[1],
      royalty
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const buyerKPGBeforeBuy = parseInt(await kepeng.balanceOf(buyer, buyer));

    const secondBuyerBid = await aManager1155.buy(
      _secondAuctionID,
      transactionFee,
      _nftAmount,
      users[2]
    );

    const buyerKPGAfterBuy = parseInt(await kepeng.balanceOf(buyer, buyer));

    assert.strictEqual(
      buyerKPGAfterBuy,
      buyerKPGBeforeBuy + (KPGWithdrawed - royaltyCost)
    );
  });

  it("should automatically receive royalty after asset sold from collectible auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const buyer = users[1];
    const secondBuyer = users[2];
    const _auctionId = 1;
    const _secondAuctionID = 2;
    const startPrice = 10000;
    const _tokenId = 0;
    const royalty = 5;
    const _nftAmount = 5;

    const kepengPersentage = parseInt((startPrice * _nftAmount * 3) / 100);
    //1500
    const transactionFee = parseInt(startPrice * _nftAmount + kepengPersentage);
    //51500
    const KPGWithdrawed = parseInt(transactionFee - kepengPersentage);
    //50000
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
    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
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
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[0],
      royalty
    );

    const creatorKPG = await kepeng.balanceOf(users[0], users[0]);

    const buyerBid = await aManager1155.buy(
      _auctionId,
      transactionFee,
      _nftAmount,
      buyer
    );

    const approveBuyerNFT = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      buyer
    );

    const createAuctionCollectible = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      _tokenId,
      _nftAmount,
      users[0],
      users[1],
      royalty
    );

    const auctionId = await aManager1155.getAuctions(users[0]);

    const creatorKPGBeforeSold = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    const secondBuyerBid = await aManager1155.buy(
      _secondAuctionID,
      transactionFee,
      _nftAmount,
      users[2]
    );

    const creatorKPGAfterSold = parseInt(
      await kepeng.balanceOf(users[0], users[0])
    );

    assert.strictEqual(creatorKPGAfterSold, creatorKPGBeforeSold + royaltyCost);
  });
});
