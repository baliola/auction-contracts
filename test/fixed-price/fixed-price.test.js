const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const helpers = require("../helpers/truffle-time-helpers")
const { fixedPriceAuctionManager, getManagerWallet, getUserWallets, getDeployedContracts, fixedPriceAuctionManagerArtifact } = require("../../utils/utils");

contract(fixedPriceAuctionManager, async (accounts) => {
    it("should change manager", async () => {
        const check = Array.isArray(accounts)

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
})