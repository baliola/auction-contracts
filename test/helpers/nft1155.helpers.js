const { getDeployedContracts, nft1155Artifact } = require("../../utils/utils");

async function balanceOf1155(address, tokenId) {
    const nft1155Contract = await getDeployedContracts(nft1155Artifact)
    const balance = await nft1155Contract.balanceOf(address, tokenId)

    return balance;
}

module.exports = {
    balanceOf1155
}