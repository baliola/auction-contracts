const { nft1155Artifact, getDeployerWallet } = require("../utils/utils")

module.exports = async function (deployers, network, accounts) {
    const contractName = "Dummy1155"
    const deployerWallet = getDeployerWallet(accounts)
    await deployers.deploy(nft1155Artifact, contractName, { from: deployerWallet })
}