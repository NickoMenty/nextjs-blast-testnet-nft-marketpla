const { ethers, network, getNamedAccounts, deployments} = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 1
let BasicNft, BasicNftAddress, BasicNftInstance

async function mintAndList() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    BasicNft = await deployments.get("WarriorNft")
    BasicNftAddress = BasicNft.address
    BasicNftInstance = await ethers.getContractAt(
        "WarriorNft",
        BasicNftAddress,
        signer,
    )
    console.log(`getting TokenURI of the NFT #${TOKEN_ID}...`)
    const uriTx = await BasicNftInstance.tokenURI(TOKEN_ID)
    console.log(uriTx)
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 block!
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
