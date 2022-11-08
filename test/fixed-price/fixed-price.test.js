const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const helpers = require("../helpers/truffle-time.helpers")
const { fixedPriceAuctionManager,
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
    getBaliolaWallet
} = require("../../utils/utils");
const { AuctionHelper } = require("../helpers/auction.helpers");
const { transferKepengFromDeployer } = require("../helpers/kepeng.helpers");
const { balanceOf1155 } = require("../helpers/nft1155.helpers");
const { ContractFactory } = require("../helpers/factory.helpers");

// IMPORTANT : always use assert.strictEqual when asserting condition

const auctionHelper = new AuctionHelper()

contract(fixedPriceAuctionManager, async (accounts) => {
    it("should change manager", async () => {
        const contractFactory = new ContractFactory()
        const currentManager = getManagerWallet(accounts)
        const userAccounts = getUserWallets(accounts)
        const kepeng = await getDeployedContracts(kepengArtifact)
        const baliolaWallet = getBaliolaWallet(accounts)
        const newManager = userAccounts[0]
        const newBaliolaWallet = userAccounts[1]

        const managerError = "only manager can call this function"

        const contract = await contractFactory.makeFixedPrice1155Manager(currentManager, kepeng.address, baliolaWallet, currentManager, { from: currentManager })
        const changeManager = await contract.changeManager(newManager, currentManager);

        try {
            const tryChangeManager = await contract.changeManager(currentManager, currentManager)
        } catch (error) {
            assert.strictEqual(error.reason, managerError)
        }

    })

    it("should create auction", async () => {
        const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)
        const initAuctionsList = await auctionManager.getAuctions()
        const users = getUserWallets(accounts)

        await auctionHelper.createDummyFixedPrice1155Auction(accounts, users[0])

        const currentAuctionList = await auctionManager.getAuctions()

        assert.strictEqual(currentAuctionList.length, initAuctionsList.length + 1)
    })

    it("should buy an nft from auction", async () => {
        const users = getUserWallets(accounts)
        const nftSeller = users[0]
        const amount = 4;
        const kepengAmount = kepengDecimals * amount;
        const buyer = users[1]
        const initBuyerBalance = balanceOf1155(buyer, defaultNftTokenId)

        await transferKepengFromDeployer(accounts, buyer, kepengAmount)
        await auctionHelper.createDummyFixedPrice1155Auction(accounts, nftSeller)
        await auctionHelper.buyNftFromAuction(buyer)

        const currentBuyerBalance = balanceOf1155(buyer, defaultNftTokenId)

        assert.strictEqual(currentBuyerBalance, initBuyerBalance + 1)
    })


})