const { ethers, network, getNamedAccounts, deployments } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.parseEther("0.1")

let BasicNft, BasicNftAddress, BasicNftInstance

async function mintAndList() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const NftMarketplace = await deployments.get("NftMarketplace")
    const NftMarketplaceAddress = NftMarketplace.address
    const NftMarketplaceInstance = await ethers.getContractAt("NftMarketplace", NftMarketplaceAddress,signer,)
    
    const randomNumber = Math.floor(Math.random() * 2)

    if (randomNumber == 1) {
        BasicNft = await deployments.get("BasicNft")
        BasicNftAddress = BasicNft.address
        BasicNftInstance = await ethers.getContractAt(
            "BasicNft",
            BasicNftAddress,
            signer,
        )
    } else {
        BasicNft = await deployments.get("BasicNftTwo")
        BasicNftAddress = BasicNft.address
        BasicNftInstance = await ethers.getContractAt(
            "BasicNftTwo",
            BasicNftAddress,
            signer,
        )

    }
    console.log("Minting NFT...")
    const mintTx = await BasicNftInstance.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.logs[0].args.tokenId
    console.log("Approving NFT...")
    console.log(mintTxReceipt.logs[0].args)
    const approvalTx = await BasicNftInstance.approve(NftMarketplaceAddress, tokenId)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const tx = await NftMarketplaceInstance.listItem(BasicNftAddress, tokenId, PRICE)
    await tx.wait(1)
    console.log("NFT Listed!")
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
