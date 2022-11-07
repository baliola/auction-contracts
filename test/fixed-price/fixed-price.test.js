const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const helpers = require("../helpers/truffle-time-helpers")
const { fixedPriceAuctionManager, getManagerWallet, getUserWallets, getDeployedContracts, fixedPriceAuctionManagerArtifact, nft1155, nft1155Artifact, getDeployerWallet } = require("../../utils/utils");

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
        const price = 1e4
        const deployer = getDeployerWallet(accounts)
        const userWallets = getUserWallets(accounts)
        const user = userWallets[0]
        const nft1155Contract = await getDeployedContracts(nft1155Artifact)
        const nftTokenId = 0
        const nftAmount = 1
        const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)
        const initAuctionsList = await auctionManager.getAuctions()

        // mint nft for auction and set approval for auction manager 
        await nft1155Contract.mint(user, nftAmount, "0x", { from: deployer });
        await nft1155Contract.setApprovalForAll(auctionManager.address, true, { from: user })

        // create auction
        await auctionManager.createAuction(price, nft1155Contract.address, nftTokenId, nftAmount, user, { from: user })
        const currentAuctionList = await auctionManager.getAuctions()

        assert.strictEqual(currentAuctionList.length, initAuctionsList.length + 1)
    })

})