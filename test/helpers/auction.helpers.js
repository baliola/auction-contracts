const { getDeployerWallet, getUserWallets, getDeployedContracts, nft1155Artifact, fixedPriceAuctionManagerArtifact } = require("../../utils/utils")

async function createDummyFixedPrice1155Auction(accounts) {
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
}


module.exports = {
    createDummyFixedPrice1155Auction
}