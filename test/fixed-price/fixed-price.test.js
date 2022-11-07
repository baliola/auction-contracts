const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const helpers = require("../helpers/truffle-time-helpers")
const { fixedPriceAuctionManager } = require("../../utils/utils");

contract(fixedPriceAuctionManager, async (accounts) => {
    it("lmao test", () => {
        assert.equal(1, 1);
    })
})