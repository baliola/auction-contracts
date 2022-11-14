// contract abi/artifacts
const auction721Artifact = artifacts.require("Auction721");
const auction1155Artifact = artifacts.require("Auction1155");
const auctionManager721Artifact = artifacts.require("AuctionManager721");
const auctionManager1155Artifact = artifacts.require("AuctionManager1155");
const nft721Artifact = artifacts.require("Dummy721");
const nft1155Artifact = artifacts.require("Dummy1155");
const fixedPriceAuctionArtifact = artifacts.require("AuctionFixedPrice1155");
const fixedPriceAuctionManagerArtifact = artifacts.require(
  "FixedPriceAuctionManager1155"
);
const kepengArtifact = artifacts.require("KEPENG");

// contract name definitions
const auction721 = "Auction721";
const auction1155 = "Auction1155";
const auctionManager721 = "AuctionManager721";
const auctionManager1155 = "AuctionManager1155";
const nft721 = "Dummy721";
const nft1155 = "Dummy1155";
const fixedPriceAuction = "AuctionFixedPrice1155";
const fixedPriceAuctionManager = "FixedPriceAuctionManager1155";
const kepeng = "KEPENG";

const kepengDecimals = 1e4;

const defaultAuctionIndex = 1;
const defaultNftAMount = 1;

const defaultNftTokenId = 0;

/**
 *
 * @param {any} contract use the contract abi constants defined in utils.js
 * @returns contract instance
 */
function getDeployedContracts(contractArtifact) {
  const contract = contractArtifact.deployed();

  return contract;
}

/**
 *
 * @returns address used as baliola's placeholder
 */
function getBaliolaWallet(accounts) {
  return accounts[0];
}

/**
 *
 * @returns test contract manager address
 */
function getManagerWallet(accounts) {
  return accounts[1];
}

/**
 * @returns test contract deployer wallet address
 */
function getDeployerWallet(accounts) {
  return accounts[0];
}

/**
 *
 * @returns all dummy user accounts
 */
function getUserWallets(accounts) {
  let returnAccounts = [];
  accounts.map((account) => {
    returnAccounts.push(account);
  });

  for (let i = 0; i < 2; i++) {
    returnAccounts.shift();
  }
  return returnAccounts;
}

async function instantiateAuctionContractAtAddress(address) {
  const auction = await fixedPriceAuctionArtifact.at(address);

  return auction;
}

module.exports = {
  auction721,
  auction1155,
  auctionManager721,
  auctionManager1155,
  nft721,
  nft1155,
  fixedPriceAuction,
  fixedPriceAuctionManager,
  kepeng,
  auction721Artifact,
  auction1155Artifact,
  auctionManager721Artifact,
  auctionManager1155Artifact,
  nft721Artifact,
  nft1155Artifact,
  fixedPriceAuctionManagerArtifact,
  fixedPriceAuctionArtifact,
  kepengArtifact,
  kepengDecimals,
  defaultAuctionIndex,
  defaultNftAMount,
  defaultNftTokenId,
  getDeployedContracts,
  getBaliolaWallet,
  getManagerWallet,
  getUserWallets,
  getDeployerWallet,
  instantiateAuctionContractAtAddress,
};
