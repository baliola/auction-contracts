import { assert } from 'chai';
import truffleAssert from "truffle-assertions"
import * as helpers from "../helpers/truffle-time-helpers"
import { fixedPriceAuctionManager } from '../../utils/utils';

contract(fixedPriceAuctionManager, async (accounts) => {
    it("lmao test", () => {
        assert.equal(1, 1);
    })
})