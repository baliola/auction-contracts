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
const { int } = require("smartcontract-type-binding-generator");

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper();

ContractFactory(fixedPriceAuctionManager, async (defaultAccount) => {
  it("should create auction with royalties", async () => {
    const accounts = defaultAccount;
    const contractFactory = new ContractFactory();
    const users = getUserWallets(accounts);
    const baliolaWallet = getBaliolaWallet(accounts);
  });
});
