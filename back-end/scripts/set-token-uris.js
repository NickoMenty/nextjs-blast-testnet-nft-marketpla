const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
const fs = require("fs")
const path = require("path")


const metadataLocation = "./warriorsNfts.json"
let BasicNft, BasicNftAddress, BasicNftInstance

async function setTokenUris() {
    let tokenUris
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    BasicNft = await deployments.get("WarriorNft")
    BasicNftAddress = BasicNft.address
    BasicNftInstance = await ethers.getContractAt(
        "WarriorNft",
        BasicNftAddress,
        signer,
    )
    console.log(`setting TokenURIs...`)
    const urisTx = await BasicNftInstance._initializeContract(tokenUris)
    await urisTx.wait(1)
    console.log(urisTx)
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 block!
        await moveBlocks(2, (sleepAmount = 1000))
    }


    async function handleTokenUris() {
        // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
        // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
        // You could also look at pinata https://www.pinata.cloud/
        const metadataJson = JSON.parse(fs.readFileSync(metadataLocation, "utf8"))
        tokenUris = []
        let i = 1;  // For loop initializer
        while (i < 11)  // For loop condition (and the actual loop)
        {   
            const tokenUri = metadataJson[i]
            console.log(tokenUri)
            console.log(`Uploading ${tokenUri.name}...`)
            const metadataUploadResponse = await storeTokenUriMetadata(tokenUri)
            tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
            i++
        }    
        console.log("Token URIs uploaded! They are:")
        console.log(tokenUris)
        return tokenUris
        }
}

setTokenUris()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
