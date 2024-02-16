// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfsNft__AlreadyInitialized();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__TransferFailed();
error RandomIpfsNft__MaxSupplyReached();

contract RandomIpfsNft is ERC721URIStorage, Ownable {
    // Types
    enum Breed {
        PICKACHY,
        RAICHY,
        PICHY
    }

    // NFT Variables
    uint256 private immutable i_mintFee;
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    uint256 private immutable i_maxSupply;
    string[] internal s_genTokenUris;
    bool private s_initialized;
    

    // VRF Helpers
    // mapping(uint256 => address) public s_requestIdToSender;

    // Events
    event NftMinted(Breed breed, address minter);

    constructor(
        uint256 mintFee,
        string[3] memory genTokenUris,
        uint256 maxSupply
    ) ERC721 ("Generation Pickachy", "PICA") {
        _initializeContract(genTokenUris);
        i_mintFee = mintFee;
        s_tokenCounter = 0;
        i_maxSupply = maxSupply;
    }

    function requestNft() public payable {
        if (s_tokenCounter >= i_maxSupply) {
            revert RandomIpfsNft__MaxSupplyReached(); // Check for max supply
        }
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETHSent();
        }
        address genOwner = msg.sender;
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        uint256 randomWords = setNumber();
        uint256 moddedRng = randomWords % MAX_CHANCE_VALUE;
        Breed genBreed = getBreedFromModdedRng(moddedRng);
        _safeMint(genOwner, newItemId);
        _setTokenURI(newItemId, s_genTokenUris[uint256(genBreed)]);
        emit NftMinted(genBreed, genOwner);
        
    }

    function setNumber() internal view returns (uint256){
        uint256 inputNo = uint256(block.timestamp);
        uint256 randNo= uint256(keccak256(abi.encodePacked (msg.sender, block.timestamp, inputNo)));
        return randNo;
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 40, MAX_CHANCE_VALUE];
    }

    function _initializeContract(string[3] memory genTokenUris) private {
        if (s_initialized) {
            revert RandomIpfsNft__AlreadyInitialized();
        }
        s_genTokenUris = genTokenUris;
        s_initialized = true;
    }

    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
                // PICKACHY = 0 - 9  (10%)
                // RAICHY = 10 - 39  (30%)
                // PICHY = 40 = 99 (60%)
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getgenTokenUris(uint256 index) public view returns (string memory) {
        return s_genTokenUris[index];
    }

    function getInitialized() public view returns (bool) {
        return s_initialized;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}