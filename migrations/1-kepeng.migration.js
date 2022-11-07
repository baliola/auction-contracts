const { kepengArtifact, getDeployerWallet } = require("../utils/utils")

module.exports = async function (deployer, network, accounts) {
    const deployerAddress = getDeployerWallet(accounts)
    await deployer.deploy(kepengArtifact, { from: deployerAddress })
}