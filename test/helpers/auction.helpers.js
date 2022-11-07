const { getDeployerWallet, getUserWallets, getDeployedContracts, nft1155Artifact, fixedPriceAuctionManagerArtifact } = require("../../utils/utils")

/**
 * the amount of nft will be auctioned default to 1 and 10000 for the price 
 */
async function createDummyFixedPrice1155Auction(accounts, nftSellerAddress) {
    // TODO : customize price and nft amount 
    const price = 1e4
    const deployer = getDeployerWallet(accounts)
    const nft1155Contract = await getDeployedContracts(nft1155Artifact)
    const nftTokenId = 0
    const nftAmount = 1
    const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)

    // mint nft for auction and set approval for auction manager 
    await nft1155Contract.mint(nftSellerAddress, nftAmount, "0x", { from: deployer });
    await nft1155Contract.setApprovalForAll(auctionManager.address, true, { from: nftSellerAddress })

    // create auction
    await auctionManager.createAuction(price, nft1155Contract.address, nftTokenId, nftAmount, nftSellerAddress, { from: nftSellerAddress })
}

function getDefaultMarkupFee() {
    const defaultFee = 1e4
    const markupFee = 3 / 100

    const fee = defaultFee * markupFee

    return fee
}

module.exports = {
    createDummyFixedPrice1155Auction,
    getDefaultMarkupFee
}