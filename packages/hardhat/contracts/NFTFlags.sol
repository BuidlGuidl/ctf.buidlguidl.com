//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// TODO: Think if ERC1155 is a better choice
// TODO: Check if the user have registered to the ctf before minting (Challenge1)?
contract NFTFlags is ERC721, IERC721Receiver , Ownable {
    using Strings for uint256;

    mapping(address => bool) public allowedMinters;
    uint256 public tokenIdCounter;
    mapping(uint256 => uint256) public tokenIdToChallengeId; 
    mapping(address => mapping(uint256 => bool)) public hasMinted;

    event FlagMinted(address indexed minter, uint256 indexed tokenId, uint256 indexed challengeId);

    constructor(address _initialOwner) ERC721("BG-CTF", "CTF") {
        transferOwnership(_initialOwner);
    }

    function mint(address _recipient, uint256 _challengeId) external {
        require(allowedMinters[msg.sender], "Not allowed to mint");
        _mintToken(_recipient, _challengeId);
    }

    function _mintToken(address _recipient, uint256 _challengeId) internal {
        require(!hasMinted[_recipient][_challengeId], "Address has already minted for this challenge");

        tokenIdCounter++;
        uint256 newTokenId = tokenIdCounter;
        _safeMint(_recipient, newTokenId);
        tokenIdToChallengeId[newTokenId] = _challengeId;
        hasMinted[_recipient][_challengeId] = true;
        emit FlagMinted(_recipient, newTokenId, _challengeId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory svg = generateSVG(tokenId);
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Flag #',
                        tokenId.toString(),
                        '", "description": "A simple flag NFT", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // TODO: Flag SVG
    function generateSVG(uint256 tokenId) internal view returns (string memory) {
        uint256 challengeId = tokenIdToChallengeId[tokenId];
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">',
                '<rect width="100%" height="100%" fill="white"/>',
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="black">',
                'Challenge #',
                challengeId.toString(),
                '</text>',
                '</svg>'
            )
        );
    }

    function addAllowedMinterMultiple(address[] calldata minters) external onlyOwner {
        for (uint256 i = 0; i < minters.length; i++) {
            allowedMinters[minters[i]] = true;
        }
    }


    function addAllowedMinter(address minter) external onlyOwner {
        allowedMinters[minter] = true;
    }

    function removeAllowedMinter(address minter) external onlyOwner {
        allowedMinters[minter] = false;
    }

    // https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol#L374
    function _toUint256(bytes memory _bytes) internal pure returns (uint256) {
        require(_bytes.length >= 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(_bytes, 0x20))
        }

        return tempUint;
    }

    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        uint256 anotherTokenId = _toUint256(data);

        require(
            msg.sender == address(this),
            "only this contract can call this function!"
        );

        require(
            ownerOf(anotherTokenId) == from, 
            "Not owner!"
        );

        require(tokenIdToChallengeId[tokenId] == 1, "Not the right token 1!");
        require(tokenIdToChallengeId[anotherTokenId] == 6, "Not the right token 6!");

        _mintToken(from, 7);

        safeTransferFrom(address(this), from, tokenId);

        return this.onERC721Received.selector;
    }
}
