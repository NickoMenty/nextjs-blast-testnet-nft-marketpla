const { ethers, network, getNamedAccounts, deployments } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 8

async function cancel() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const NftMarketplace = await deployments.get("NftMarketplace")
    const NftMarketplaceAddress = NftMarketplace.address
    const NftMarketplaceInstance = await ethers.getContractAt("NftMarketplace", NftMarketplaceAddress,signer,)
    
    const BasicNft = await deployments.get("BasicNft")
    const BasicNftAddress = BasicNft.address
    const BasicNftInstance = await ethers.getContractAt(
        "BasicNft",
        BasicNftAddress,
        signer,
    )
    const tx = await NftMarketplaceInstance.cancelListing(BasicNftAddress, TOKEN_ID)
    await tx.wait(1)
    console.log("NFT Canceled!")
    if ((network.config.chainId == "31337")) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
