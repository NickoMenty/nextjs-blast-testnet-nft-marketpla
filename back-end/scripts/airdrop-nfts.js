const { ethers, network, getNamedAccounts, deployments} = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.parseEther("0.01")
const QUANTITY = [1]
const RECEPIENTS = ["0xdaaEd1F389a89da771e0516ce2d0da018A92913b"]
let BasicNft, BasicNftAddress, BasicNftInstance

async function airdropNfts() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    BasicNft = await deployments.get("WarriorNft")
    BasicNftAddress = BasicNft.address
    BasicNftInstance = await ethers.getContractAt(
        "WarriorNft",
        BasicNftAddress,
        signer,
    )
    console.log("Airdropping NFTs...")
    const airdropTx = await BasicNftInstance.airdropToken(QUANTITY, RECEPIENTS)
    const airdropTxReceipt = await airdropTx.wait(1)
    console.log(
        `Airdroped NFTs from contract: ${
            BasicNftAddress
        }`
    )
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 block!
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

airdropNfts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
