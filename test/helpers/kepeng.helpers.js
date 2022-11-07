const { getDeployedContracts, kepengArtifact, getDeployerWallet } = require("../../utils/utils");

async function transferKepengFromDeployer(accounts, toAddress, amount) {
    const deployer = getDeployerWallet(accounts)
    const kepengContract = await getDeployedContracts(kepengArtifact)

    await kepengContract.transfer(toAddress, amount)
}

module.exports = {
    transferKepengFromDeployer
}