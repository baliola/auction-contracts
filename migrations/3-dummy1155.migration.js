const { nft1155Artifact } = require("../utils/utils")

module.exports = async function (deployers) {
    const contractName = "Dummy1155"
    await deployers.deploy(nft1155Artifact, contractName)
}