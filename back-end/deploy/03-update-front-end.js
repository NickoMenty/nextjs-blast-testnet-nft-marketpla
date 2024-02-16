const {
    frontEndContractsFile,
    frontEndContractsFile2,
    frontEndAbiLocation,
    frontEndAbiLocation2,
} = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    // const nftMarketplace = await ethers.getContract("NftMarketplace")
    // const { deployer } = await getNamedAccounts()
    // const signer = await ethers.getSigner(deployer)
    const _NftMarketplace = await deployments.get("NftMarketplace")
    // const NftMarketplaceAddress = NftMarketplace.address
    const NftMarketplaceInstance = await ethers.getContractAt("NftMarketplace", _NftMarketplace.address)
    
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        NftMarketplaceInstance.interface.formatJson()
    )
    fs.writeFileSync(
        `${frontEndAbiLocation2}NftMarketplace.json`,
        NftMarketplaceInstance.interface.formatJson()
    )

    const _BasicNft = await deployments.get("BasicNft")
    // const BasicNftAddress = BasicNft.address
    const BasicNftInstance = await ethers.getContractAt(
        "BasicNft",
        _BasicNft.address
    )
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        BasicNftInstance.interface.formatJson()
    )
    fs.writeFileSync(
        `${frontEndAbiLocation2}BasicNft.json`,
        BasicNftInstance.interface.formatJson()
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    // const nftMarketplace = await ethers.getContract("NftMarketplace")
    // const { deployer } = await getNamedAccounts()
    // const signer = await ethers.getSigner(deployer)
    const _NftMarketplace = await deployments.get("NftMarketplace")
    // const NftMarketplaceAddress = NftMarketplace.address
    const NftMarketplaceInstance = await ethers.getContractAt("NftMarketplace", _NftMarketplace.address)
    
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(_NftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(_NftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [_NftMarketplace.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
    fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
