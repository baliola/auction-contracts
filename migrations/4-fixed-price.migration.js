const { fixedPriceAuctionManagerArtifact, getBaliolaWallet, getManagerWallet, getDeployedContracts, kepeng, kepengArtifact } = require("../utils/utils")
const fs = require("fs");
const path = require("path");

module.exports = async function (deployer, network, accounts) {
    const baliolaWallet = getBaliolaWallet(accounts);
    const managerWallet = getManagerWallet(accounts);
    const kepeng = await getDeployedContracts(kepengArtifact);

    await deployer.deploy(fixedPriceAuctionManagerArtifact, kepeng.address, baliolaWallet, managerWallet);
}