const { getDeployedContracts, kepengArtifact, getDeployerWallet } = require("../../utils/utils");

class KepengHelper {

    async transferKepengFromDeployer(accounts, toAddress, amount) {
        const deployer = getDeployerWallet(accounts)
        const kepengContract = await getDeployedContracts(kepengArtifact)

        await kepengContract.transfer(toAddress, amount)
    }
}

module.exports = {
    KepengHelper
}