const { assert, should } = require("chai");
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

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

contract(fixedPriceAuctionManager, async (defaultAccounts) => {
  it("should change manager", async () => {
    const contractFactory = new ContractFactory();
    const accounts = defaultAccounts;
    const currentManager = getManagerWallet(accounts);
    const userAccounts = getUserWallets(accounts);
    const kepeng = await getDeployedContracts(kepengArtifact);
    const baliolaWallet = getBaliolaWallet(accounts);
    const newManager = userAccounts[0];
    const contract = await contractFactory.makeFixedPrice1155Manager(
      currentManager,
      kepeng.address,
      baliolaWallet,
      currentManager,
      { from: currentManager }
    );
    const changeManager = await contract.changeManager(
      newManager,
      currentManager
    );

    try {
      const tryChangeManager = await contract.changeManager(
        currentManager,
        currentManager
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    }
  });

  it("should create auction", async () => {
    const accounts = defaultAccounts;

    const auctionManager = await getDeployedContracts(
      fixedPriceAuctionManagerArtifact
    );
    const initAuctionsList = await auctionManager.getAuctions();
    const users = getUserWallets(accounts);

    await auctionHelper.createDummyFixedPrice1155Auction(accounts, users[0]);

    const currentAuctionList = await auctionManager.getAuctions();

    assert.strictEqual(currentAuctionList.length, initAuctionsList.length + 1);
  });

  it("should not be able to call function  with different address besides manager", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const kepeng = await contractFactory.makeKepeng(users[1]);
    const currentManager = getManagerWallet(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const newBaliolaWallet = getBaliolaWallet(accounts);
    const contract = await contractFactory.makeFixedPrice1155Manager(
      currentManager,
      kepeng.contractAddress,
      baliolaWallet,
      currentManager
    );

    try {
      const tryChangeBaliolaWallet = await contract.changeBaliolaWallet(
        newBaliolaWallet,
        users[0]
      );
    } catch (error) {
      assert.strictEqual(error.reason, COMMON_MANAGER_ERRORS.ONLY_MANAGER);
    }
  });

  it("should buy a nft from auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftAmount * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftAmount;
    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    // const kepengSmartContractAddress = await contractFactory.makeKepeng(
    //   users[0]
    // );

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      transactionFee,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    const auctionAdrress = await manager115.getUserAuction(users[0], users[0]);

    const auction1155 = await manager115.inferAuction(auctionAdrress[0]);

    const availableNft = parseInt(await auction1155.availableNFT(users[0]));

    await manager115.buy(_auctionId, transactionFee, nftAmount, buyer);

    const availableNFTAfterSold = parseInt(
      await auction1155.availableNFT(users[0])
    );

    assert.strictEqual(availableNFTAfterSold, availableNft - nftAmount);
  });

  it("should automaticaly receive nft after buying", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftAmount * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftAmount;
    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    // const kepengSmartContractAddress = await contractFactory.makeKepeng(
    //   users[0]
    // );

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      transactionFee,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    await manager115.buy(_auctionId, transactionFee, nftAmount, buyer);
    const newNftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const newNftBuyerBalanceParse = parseInt(newNftBuyerBalance);

    assert.strictEqual(
      newNftBuyerBalanceParse,
      parseInt(nftBuyerBalance) + nftAmount
    );
  });

  it("should automaticaly receive kepeng after selling", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftAmount * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftAmount;
    const totalKepengReceive = parseInt(startPrice * nftAmount);
    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng = await contractFactory.makeKepeng(users[0]);
    const kepeng2 = await contractFactory.makeKepeng(buyer);

    // const kepengSmartContractAddress = await contractFactory.makeKepeng(
    //   users[0]
    // );

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      transactionFee,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    const balanceKepengSeller = parseInt(await kepeng2.balanceOf(users[0]));
    await manager115.buy(_auctionId, transactionFee, nftAmount, buyer);
    const balanceKepengSellerAfterSell = parseInt(
      await kepeng2.balanceOf(users[0])
    );

    assert.strictEqual(
      balanceKepengSellerAfterSell,
      balanceKepengSeller + totalKepengReceive
    );
  });

  it("should refill the nft from auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const nftId = 0;
    const initNft = 10;
    const nftAmountForAuction = 5;
    const nftAmountForRefill = 5;
    const startPrice = 10000;
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], initNft, "0x", users[0]);
    const _auctionId = 1;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const balanceKepeng = await kepeng.balanceOf(
      users[0],
      kepeng.contractAddress
    );

    const aManager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.setApprovalForAll(
      aManager115.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmountForAuction,
      users[0],
      users[0]
    );

    const auctionAdrress = await aManager115.getUserAuction(users[0], users[0]);
    const auction1155 = await aManager115.inferAuction(auctionAdrress[0]);

    const availableNft = await auction1155.availableNFT(users[0]);
    const availableNFTParse = parseInt(availableNft);

    const refillNft = await aManager115.refill(
      _auctionId,
      nftAmountForRefill,
      users[0]
    );

    const availableNFTAfterRefill = parseInt(
      await auction1155.availableNFT(users[0])
    );

    assert.strictEqual(
      availableNFTAfterRefill,
      availableNFTParse + nftAmountForRefill
    );
  });

  it("should refill the nft from auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const nftId = 0;
    const initNft = 10;
    const nftAmountForAuction = 5;
    const nftAmountForRefill = 5;
    const startPrice = 10000;
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], initNft, "0x", users[0]);
    const _auctionId = 1;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const balanceKepeng = await kepeng.balanceOf(
      users[0],
      kepeng.contractAddress
    );

    const aManager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.setApprovalForAll(
      aManager115.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmountForAuction,
      users[0],
      users[0]
    );

    const auctionAdrress = await aManager115.getUserAuction(users[0], users[0]);
    const auction1155 = await aManager115.inferAuction(auctionAdrress[0]);

    const availableNft = await auction1155.availableNFT(users[0]);
    const availableNFTParse = parseInt(availableNft);

    const refillNft = await aManager115.refill(
      _auctionId,
      nftAmountForRefill,
      users[0]
    );

    const availableNFTAfterRefill = parseInt(
      await auction1155.availableNFT(users[0])
    );

    assert.strictEqual(
      availableNFTAfterRefill,
      availableNFTParse + nftAmountForRefill
    );
  });

  it("should get all auction from a user", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const nftId = 0;
    const initNft = 10;
    const nfftForFirstAuction = 5;
    const nftForSecondAuction = 5;
    const startPrice = 10000;
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], initNft, "0x", users[0]);
    const _auctionId = 1;

    const kepeng = await contractFactory.makeKepeng(users[0]);

    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const getUsersAuctionBeforeCreateAuction =
      await aManager1155.getUserAuction(users[0], users[0]);

    const createFirstAuction = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nfftForFirstAuction,
      users[0],
      users[0]
    );

    const getUserAuctionAfterCreateOneAuction =
      await aManager1155.getUserAuction(users[0], users[0]);

    const createSecondAuction = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftForSecondAuction,
      users[0],
      users[0]
    );

    const getUserAuctionAfterCreateTwoAuction =
      await aManager1155.getUserAuction(users[0], users[0]);

    assert.strictEqual(
      getUserAuctionAfterCreateTwoAuction.length,
      getUsersAuctionBeforeCreateAuction.length + 2
    );
  });

  it("should get all auction from all user", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const firstWallet = users[0];
    const secondWallet = users[1];
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const nftId = 0;
    const nftId2 = 1;
    const initNft = 5;
    const nfftForFirstWalletAuction = 5;
    const nftForSecondWalletAuction = 5;
    const startPrice = 10000;
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], initNft, "0x", users[0]);
    const mintNft2 = await nftContract.mint(users[1], initNft, "0x", users[1]);
    const _auctionId = 1;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const kepeng2 = await contractFactory.makeKepeng(users[1]);

    const aManager1155 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveFirstWalletNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[0]
    );

    const approveSecondWalletNft = await nftContract.setApprovalForAll(
      aManager1155.contractAddress,
      true,
      users[1]
    );

    const getAllAuction = await aManager1155.getAuctions(users[2]);

    const createFirstAuctionFromFirstWallet = await aManager1155.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nfftForFirstWalletAuction,
      users[0],
      users[0]
    );

    const getAllAuctionAfterFirstAuction = await aManager1155.getAuctions(
      users[2]
    );

    const createSecondAuctionFromSecondWallet =
      await aManager1155.createAuction(
        startPrice,
        nftContract.contractAddress,
        nftId2,
        nftForSecondWalletAuction,
        users[1],
        users[1]
      );

    const getAllAuctionAfterSecondAuction = await aManager1155.getAuctions(
      users[2]
    );

    assert.strictEqual(
      getAllAuctionAfterSecondAuction.length,
      getAllAuction.length + 2
    );
  });

  it("should get all the buyers", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const nftForAuction = 3;
    const nftForSecondAuction = 1;
    const buyer = users[1];
    const secondBuyer = users[2];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftForAuction * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftForAuction;

    const kepengAmountSecondBuy = (startPrice * nftForSecondAuction * 3) / 100;
    const secondTransactionFee =
      kepengAmountSecondBuy + startPrice * nftForSecondAuction;

    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng

    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);
    const transferToSecondBuyer = 100000;
    await kepeng2.transfer(secondBuyer, transferToSecondBuyer, buyer);

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      allowanceKepeng,
      buyer
    );

    await kepeng2.increaseAllowance(
      manager115.contractAddress,
      allowanceKepeng,
      secondBuyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    const auctionAdrress = await manager115.getUserAuction(users[0], users[0]);

    const auction1155 = await manager115.inferAuction(auctionAdrress[0]);

    const buyers = await auction1155.GetAllBuyers(buyer);
    await manager115.buy(_auctionId, transactionFee, nftForAuction, buyer);

    await manager115.buy(
      _auctionId,
      secondTransactionFee,
      nftForSecondAuction,
      secondBuyer
    );

    const buyersAfterSoldNft = await auction1155.GetAllBuyers(buyer);

    assert.strictEqual(buyersAfterSoldNft[0].length, buyers[0].length + 2);
  });

  //auction fix price error
  it("error test for refill : only creator can refill", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const nftId = 0;
    const initNft = 10;
    const nftAmountForAuction = 5;
    const nftAmountForRefill = 5;
    const startPrice = 10000;
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], initNft, "0x", users[0]);
    const _auctionId = 1;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const balanceKepeng = await kepeng.balanceOf(
      users[0],
      kepeng.contractAddress
    );

    const aManager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.setApprovalForAll(
      aManager115.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmountForAuction,
      users[0],
      users[0]
    );

    const auctionAdrress = await aManager115.getUserAuction(users[0], users[0]);
    const auction1155 = await aManager115.inferAuction(auctionAdrress[0]);

    const availableNft = await auction1155.availableNFT(users[0]);
    const availableNFTParse = parseInt(availableNft);

    try {
      const refillNft = await aManager115.refill(
        _auctionId,
        nftAmountForRefill,
        users[1]
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_FIXED_PRICE_AUCTION_ERRORS.ONLY_CREATOR_CAN_REFILL
      );
    }
  });

  it("error test for refill : can only refill when auction is open", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);

    const nftId = 0;
    const initNft = 10;
    const nftAmountForAuction = 5;
    const nftAmountForRefill = 5;
    const startPrice = 10000;
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const mintNft = await nftContract.mint(users[0], initNft, "0x", users[0]);
    const _auctionId = 1;

    const kepeng = await contractFactory.makeKepeng(users[0]);
    const balanceKepeng = await kepeng.balanceOf(
      users[0],
      kepeng.contractAddress
    );

    const aManager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng.contractAddress,
      baliolaWallet,
      managerWallet
    );

    const approveNft = await nftContract.setApprovalForAll(
      aManager115.contractAddress,
      true,
      users[0]
    );

    const createAuction = await aManager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmountForAuction,
      users[0],
      users[0]
    );

    const auctionAdrress = await aManager115.getUserAuction(users[0], users[0]);
    const auction1155 = await aManager115.inferAuction(auctionAdrress[0]);

    const availableNft = await auction1155.availableNFT(users[0]);
    const availableNFTParse = parseInt(availableNft);

    const endAuction = await auction1155.EndAuction(users[0]);

    try {
      const refillNft = await aManager115.refill(
        _auctionId,
        nftAmountForRefill,
        users[0]
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_FIXED_PRICE_AUCTION_ERRORS.CAN_ONLY_REFILL_WHEN_OPEN
      );
    }
  });

  it("error test for out of supply : out of supply! no nft is being selled!", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const nftForAuction = 3;
    const nftForSecondAuction = 2;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftForAuction * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftForAuction;

    const kepengAmountSecondBuy = (startPrice * nftForSecondAuction * 3) / 100;
    const secondTransactionFee =
      kepengAmountSecondBuy + startPrice * nftForSecondAuction;

    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      allowanceKepeng,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftForAuction,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    await manager115.buy(_auctionId, transactionFee, nftForAuction, buyer);

    const auctionAdrress = await manager115.getUserAuction(users[0], users[0]);

    const auction1155 = await manager115.inferAuction(auctionAdrress[0]);

    const availableNft = parseInt(await auction1155.availableNFT(users[0]));

    try {
      await manager115.buy(
        _auctionId,
        secondTransactionFee,
        nftForSecondAuction,
        buyer
      );
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_FIXED_PRICE_AUCTION_ERRORS.OUT_OF_SUPPLY
      );
    }
  });

  it("error test for not enough nft : not enough available nft!", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 0;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftAmount * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftAmount;
    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    // const kepengSmartContractAddress = await contractFactory.makeKepeng(
    //   users[0]
    // );

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      transactionFee,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );
  });

  it("error test for can only end if auction open : can only end when auction is open!", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftAmount * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftAmount;
    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    // const kepengSmartContractAddress = await contractFactory.makeKepeng(
    //   users[0]
    // );

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      transactionFee,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    const auctionAdrress = await manager115.getUserAuction(users[0], users[0]);

    const auction1155 = await manager115.inferAuction(auctionAdrress[0]);

    const availableNft = parseInt(await auction1155.availableNFT(users[0]));

    try {
      await auction1155.EndAuction(users[0]);

      await auction1155.EndAuction(users[0]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_FIXED_PRICE_AUCTION_ERRORS.CAN_ONLY_END_IF_AUCTION_IS_OPEN
      );
    }
  });

  it("error test for can only buy if auction open : can only buy if the fee is correct", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const nftForAuction = 3;
    const nftForSecondAuction = 2;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftForAuction * 3) / 100; //persenan
    const transactionFee = 0;

    const kepengAmountSecondBuy = (startPrice * nftForSecondAuction * 3) / 100;
    const secondTransactionFee =
      kepengAmountSecondBuy + startPrice * nftForSecondAuction;

    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      allowanceKepeng,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftForAuction,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    try {
      await manager115.buy(_auctionId, transactionFee, nftForAuction, buyer);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_FIXED_PRICE_AUCTION_ERRORS.CAN_ONLY_BUY_IF_FEE_IS_CORRECT
      );
    }
  });

  it("error test for only creator can end the auction : only the creator can end the auction", async () => {
    const accounts = defaultAccounts;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
    const manager = getManagerWallet(accounts);
    const nftAmount = 5;
    const buyer = users[1];

    const startPrice = 10000;
    const kepengAmount = (startPrice * nftAmount * 3) / 100; //persenan
    const transactionFee = kepengAmount + startPrice * nftAmount;
    const _auctionId = 1;
    const nftId = 0;
    const allowanceKepeng = 1000000;

    // mint nft
    const nftContract = await contractFactory.makeDummy1155Nft(users[0]);
    const nftBuyerBalance = await nftContract.balanceOf(buyer, nftId);
    const mintNft = await nftContract.mint(users[0], nftAmount, "0x", users[0]);

    // mint kepeng
    const kepeng2 = await contractFactory.makeKepeng(buyer);
    const balanceKepengUserTwo = await kepeng2.balanceOf(buyer);

    // const kepengSmartContractAddress = await contractFactory.makeKepeng(
    //   users[0]
    // );

    const manager115 = await contractFactory.makeFixedPrice1155Manager(
      users[0],
      kepeng2.contractAddress,
      baliolaWallet,
      manager
    );

    const approveNft = await nftContract.setApprovalForAll(
      manager115.contractAddress,
      true,
      users[0]
    );

    const approveKepeng = await kepeng2.increaseAllowance(
      manager115.contractAddress,
      transactionFee,
      buyer
    );

    await manager115.createAuction(
      startPrice,
      nftContract.contractAddress,
      nftId,
      nftAmount,
      users[0],
      users[0]
    );

    const allowance = await kepeng2.allowance(
      buyer,
      manager115.contractAddress
    );

    const auctionAdrress = await manager115.getUserAuction(users[0], users[0]);

    const auction1155 = await manager115.inferAuction(auctionAdrress[0]);

    try {
      await auction1155.EndAuction(users[5]);
    } catch (error) {
      assert.strictEqual(
        error.reason,
        SPECIAL_FIXED_PRICE_AUCTION_ERRORS.ONLY_CREATOR_CAN_END_AUCTION
      );
    }
  });
});
