const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 2

async function buyItem() {
    // const { deployer } = await getNamedAccounts()
    // const signer = await ethers.getSigner(deployer)
    const _NftMarketplace = await deployments.get("NftMarketplace")
    // const NftMarketplaceAddress = NftMarketplace.address
    const NftMarketplaceInstance = await ethers.getContractAt("NftMarketplace", _NftMarketplace.address)
    
    const _BasicNft = await deployments.get("BasicNft")
    // const BasicNftAddress = BasicNft.address
    const BasicNftInstance = await ethers.getContractAt(
        "BasicNft",
        _BasicNft.address
    )
    const listing = await NftMarketplaceInstance.getListing(_BasicNft.address, TOKEN_ID)
    const price = listing.price.toString()
    const tx = await NftMarketplaceInstance.buyItem(_BasicNft.address, TOKEN_ID, { value: price })
    await tx.wait(1)
    console.log("NFT Bought!")
    if ((network.config.chainId == "31337")) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
