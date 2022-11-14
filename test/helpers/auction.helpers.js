const { getDeployerWallet, getUserWallets, getDeployedContracts, nft1155Artifact, fixedPriceAuctionManagerArtifact, instantiateAuctionContractAtAddress, defaultNftAMount, kepengArtifact, defaultNftTokenId } = require("../../utils/utils");
const { balanceOf1155 } = require("./nft1155.helpers");

const defaultAuctionIndex = 1;

class AuctionHelper {

    /**
    * 
    * @param {string[]} accounts array of users accounts provided by truffle
    * @param {string} nftSellerAddress nft seller address
    * @param {*} aucitonManagerInstace will create a new auction in auction manager instance if provided
    */
    async createDummyFixedPrice1155AuctionWithAuctionManagerInstance(accounts, nftSellerAddress, auctionManagerInstace) {

    }

    /**
     * the amount of nft will be auctioned default to 1 and 10000(1 KPG) for the price 
     */
    async createDummyFixedPrice1155Auction(accounts, nftSellerAddress) {
        // TODO : customize price and nft amount 
        const price = 1e4
        const deployer = getDeployerWallet(accounts)
        const nft1155Contract = await getDeployedContracts(nft1155Artifact)
        const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)

        // mint nft for auction and set approval for auction manager 
        await nft1155Contract.mint(nftSellerAddress, defaultNftAMount, "0x", { from: deployer });
        await nft1155Contract.setApprovalForAll(auctionManager.address, true, { from: nftSellerAddress })

        // create auction
        await auctionManager.createAuction(price, nft1155Contract.address, defaultNftTokenId, defaultNftAMount, nftSellerAddress, { from: nftSellerAddress })
    }

    /**
     * this  will use default auction index for getting the underlying auction contract
     * 
     * @param  {string} user address 
     * @returns void
     */
    async buyNftFromAuction(user) {
        const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)
        const fee = getDefaultMarkupFee()

        await approveFixedPriceAuctionManager(user, fee)
        await auctionManager.buy(defaultAuctionIndex, fee, defaultNftAMount)

        return;
    }

    /**
     * @param {string} address user address
     * @param {number} amount the amount to be approved
     * @returns void
     * 
     * approve auction manager for spending kepeng. 
     */
    async approveFixedPriceAuctionManager(address, amount) {
        const auctionManager = getDeployedContracts(fixedPriceAuctionManagerArtifact)
        const kepengContract = getDeployedContracts(kepengArtifact)

        await kepengContract.approve(auctionManager.address, amount)
        return;
    }

    /**
     * 
     * @returns {number} default markup fee
     */
    getDefaultMarkupFee() {
        const defaultFee = 1e4
        const markupFee = 3 / 100

        const fee = defaultFee * markupFee

        return fee
    }
}


module.exports = {
    AuctionHelper,
    defaultAuctionIndex
}