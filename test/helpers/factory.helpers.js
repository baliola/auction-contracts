const { auction721Artifact, auction1155Artifact, auctionManager721Artifact, auctionManager1155Artifact, nft721Artifact, nft1155Artifact, fixedPriceAuction, fixedPriceAuctionArtifact, fixedPriceAuctionManagerArtifact, kepengArtifact } = require("../../utils/utils");

class ContractFactory {

    /**
     * this is a low level api for deploying new auction contract, you might not need this
     * 
     * @param {string} deployerAddress 
     * @param {string} creator 
     * @param {number} endTime 
     * @param {string} baliolaWallet 
     * @param {boolean} directBuyStatus 
     * @param {number} directBuyPrice 
     * @param {number} startPrice 
     * @param {string} nftContractAddress 
     * @param {number} nftTokenId 
     * @param {any} kepengContractInstance 
     * @param {string} nftSellerAddress 
     * @returns auction 721 contract instance
     */
    async make721Auction(
        deployerAddress,
        creator,
        endTime,
        baliolaWallet,
        directBuyStatus,
        directBuyPrice,
        startPrice,
        nftContractAddress,
        nftTokenId,
        kepengContractInstance,
        nftSellerAddress
    ) {
        return await auction721Artifact.new(creator,
            endTime,
            baliolaWallet,
            directBuyStatus,
            directBuyPrice,
            startPrice,
            nftContractAddress,
            nftTokenId,
            kepengContractInstance,
            nftSellerAddress, { from: deployerAddress }
        )
    }
    /**
     * 
     * this is a low level api for deploying new auction contract, you might not need this
     * 
     * @param {string} deployerAddress 
     * @param {string} creator 
     * @param {number} endtime 
     * @param {string} baliolaWallet 
     * @param {boolean} directBuyStatus 
     * @param {number} directBuyPrice 
     * @param {number} startPrice 
     * @param {string} nftContractAddress 
     * @param {number} nftTokenId 
     * @param {number} nftAmount 
     * @param {any} kepengContractInstance 
     * @param {string} nftSellerAddress 
     * @returns auction 1155 contract instance
     */
    async make1155Auction(
        deployerAddress,
        creator,
        endtime,
        baliolaWallet,
        directBuyStatus,
        directBuyPrice,
        startPrice,
        nftContractAddress,
        nftTokenId,
        nftAmount,
        kepengContractInstance,
        nftSellerAddress
    ) {
        return await auction1155Artifact.new(
            deployerAddress,
            creator,
            endtime,
            baliolaWallet,
            directBuyStatus,
            directBuyPrice,
            startPrice,
            nftContractAddress,
            nftTokenId,
            nftAmount,
            kepengContractInstance,
            nftSellerAddress, { from: deployerAddress }

        )
    }
    /**
     * 
     * @param {string} deployerAddress 
     * @param {string} kepengSmartContractAddress 
     * @param {string} baliolaWallet 
     * @param {string} managerAddress 
     * @returns auction 721 manager instance
     */
    async make721AuctionManager(deployerAddress, kepengSmartContractAddress, baliolaWallet, managerAddress) {
        return await auctionManager721Artifact.new(
            kepengSmartContractAddress,
            baliolaWallet,
            managerAddress, { from: deployerAddress }
        )
    }
    /**
     * 
     * @param {string} deployerAddress 
     * @param {string} kepengSmartContractAddress 
     * @param {string} baliolaWallet 
     * @param {string} managerAddress 
     * @returns auction 1155 manager instance
     */
    async make1155AuctionManager(deployerAddress, kepengSmartContractAddress, baliolaWallet, managerAddress) {
        return await auctionManager1155Artifact.new(
            kepengSmartContractAddress,
            baliolaWallet,
            managerAddress, { from: deployerAddress }

        )
    }

    /**
     * 
     * @returns dummy nft 721 contract instance
     */
    async makeDummy721Nft() {
        return await nft721Artifact.new()
    }

    /**
     * 
     * @param {string} deployerAddress 
     * @returns dummy nft 1155 contract instance
     */
    async makeDummy1155Nft(deployerAddress) {
        return await nft1155Artifact.new({ from: deployerAddress })
    }

    /**
     * 
     * this is a low level api for deploying new auction contract, you might not need this
     * 
     * @param {string} deployerAddress
     * @param {string} creator 
     * @param {string} baliolaWallet 
     * @param {string} nftContractAddress 
     * @param {number} tokenId 
     * @param {number} nftAmount 
     * @param {number} price 
     * @param {any} kepengContractInstance 
     * @param {string} nftSellerAddress 
     * @returns fixed price 1155 contract instance
     */
    async makeFixedPrice1155(
        deployerAddress,
        creator,
        baliolaWallet,
        nftContractAddress,
        tokenId,
        nftAmount,
        price,
        kepengContractInstance,
        nftSellerAddress
    ) {
        return await fixedPriceAuctionArtifact.new(
            creator,
            baliolaWallet,
            nftContractAddress,
            tokenId,
            nftAmount,
            price,
            kepengContractInstance,
            nftSellerAddress, { from: deployerAddress }

        )
    }
    /**
     * @param {string} deployerAddress
     * @param {string} kepengSmartContractAddress 
     * @param {string} baliolaWallet 
     * @param {string} managerAddress 
     * @returns fixed price 1155 manager instance
     */
    async makeFixedPrice1155Manager(
        deployerAddress,
        kepengSmartContractAddress,
        baliolaWallet,
        managerAddress
    ) {
        return await fixedPriceAuctionManagerArtifact.new(
            kepengSmartContractAddress,
            baliolaWallet,
            managerAddress
        )

    }
    /**
     * @returns kepeng contract instance
     */
    async makeKepeng() {
        return await kepengArtifact.new()
    }
}

module.exports = {
    ContractFactory
}