const { kepengArtifact } = require("../utils/utils")

module.exports = async function (deployer) {
    await deployer.deploy(kepengArtifact)
}