const { nft1155Artifact } = require("../utils/utils")

module.exports = async function (deployers) {
    await deployers.deploy(nft1155Artifact)
}