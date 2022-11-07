const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const helpers = require("../helpers/truffle-time.helpers")
const { fixedPriceAuctionManager, getManagerWallet, getUserWallets, getDeployedContracts, fixedPriceAuctionManagerArtifact, nft1155, nft1155Artifact, getDeployerWallet } = require("../../utils/utils");
const { createDummyFixedPrice1155Auction } = require("../helpers/auction.helpers");

// IMPORTANT : always use assert.strictEqual when asserting condition

contract(fixedPriceAuctionManager, async (accounts) => {
    it("should change manager", async () => {
        const currentManager = getManagerWallet(accounts)
        const userAccounts = getUserWallets(accounts)
        const newManager = userAccounts[0]
        const newBaliolaWallet = userAccounts[1]

        const managerError = "only manager can call this function"

        const contract = await getDeployedContracts(fixedPriceAuctionManagerArtifact)

        const changeManager = await contract.changeManager(newManager, { from: currentManager });

        try {
            const tryChangeManager = await contract.changeManager(currentManager, { from: currentManager })
        } catch (error) {
            assert.strictEqual(error.reason, managerError)
        }

    })

    it("should create auction", async () => {
        const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)
        const initAuctionsList = await auctionManager.getAuctions()

        await createDummyFixedPrice1155Auction(accounts)

        const currentAuctionList = await auctionManager.getAuctions()

        assert.strictEqual(currentAuctionList.length, initAuctionsList.length + 1)
    })

})