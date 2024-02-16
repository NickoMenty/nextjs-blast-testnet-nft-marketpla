const { ethers, network, getNamedAccounts, deployments} = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.parseEther("0.01")
let BasicNft, BasicNftAddress, BasicNftInstance

async function mintAndList() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    BasicNft = await deployments.get("BasicNft")
    BasicNftAddress = BasicNft.address
    BasicNftInstance = await ethers.getContractAt(
        "BasicNft",
        BasicNftAddress,
        signer,
    )
    console.log("Minting NFT...")
    const mintTx = await BasicNftInstance.mintNft({value: PRICE})
    const mintTxReceipt = await mintTx.wait(1)
    console.log(
        `Minted tokenId ${mintTxReceipt.logs[0].args.tokenId.toString()} from contract: ${
            BasicNftAddress
        }`
    )
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
