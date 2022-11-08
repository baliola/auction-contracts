const { getDeployerWallet, getUserWallets, getDeployedContracts, nft1155Artifact, fixedPriceAuctionManagerArtifact, instantiateAuctionContractAtAddress, defaultNftAMount, kepengArtifact } = require("../../utils/utils")

const defaultAuctionIndex = 1;
/**
 * the amount of nft will be auctioned default to 1 and 10000(1 KPG) for the price 
 */
async function createDummyFixedPrice1155Auction(accounts, nftSellerAddress) {
    // TODO : customize price and nft amount 
    const price = 1e4
    const deployer = getDeployerWallet(accounts)
    const nft1155Contract = await getDeployedContracts(nft1155Artifact)
    const nftTokenId = 0
    const auctionManager = await getDeployedContracts(fixedPriceAuctionManagerArtifact)

    // mint nft for auction and set approval for auction manager 
    await nft1155Contract.mint(nftSellerAddress, defaultNftAMount, "0x", { from: deployer });
    await nft1155Contract.setApprovalForAll(auctionManager.address, true, { from: nftSellerAddress })

    // create auction
    await auctionManager.createAuction(price, nft1155Contract.address, nftTokenId, nftAmount, nftSellerAddress, { from: nftSellerAddress })
}

/**
 * this function will use default auction index for getting the underlying auction contract
 * 
 * @param  user address 
 * @returns void
 */
async function buyNftFromAuction(user) {
    const auctionManager = getDeployedContracts(fixedPriceAuctionManagerArtifact)
    const fee = getDefaultMarkupFee()

    await approveFixedPriceAuctionManager(user, fee)
    await auctionManager.buy(defaultAuctionIndex, fee, defaultNftAMount)

    return;
}

/**
 * @param {*} address user address
 * @param {*} amount the amount to be approved
 * @returns void
 * 
 * approve auction manager for spending kepeng. 
 */
async function approveFixedPriceAuctionManager(address, amount) {
    const auctionManager = getDeployedContracts(fixedPriceAuctionManagerArtifact)
    const kepengContract = getDeployedContracts(kepengArtifact)

    await kepengContract.approve(auctionManager.address, amount)
    return;
}

function getDefaultMarkupFee() {
    const defaultFee = 1e4
    const markupFee = 3 / 100

    const fee = defaultFee * markupFee

    return fee
}

module.exports = {
    createDummyFixedPrice1155Auction,
    getDefaultMarkupFee,
    buyNftFromAuction,
    approveFixedPriceAuctionManager,
    defaultAuctionIndex
}