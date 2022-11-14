const { nft721Artifact } = require("../utils/utils")

module.exports = async function (deployers) {
    await deployers.deploy(nft721Artifact)
}