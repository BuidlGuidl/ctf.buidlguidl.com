// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./NFTFlags.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC721URIStorage, ERC721 } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Gamified contract names
contract Season2Challenge12HeroNFT is ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("Challenge12HeroNFT", "C12HERO") {}

    function mint(string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);

        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}

contract Season2Challenge12GoldToken is ERC20 {
    address public challenge12HeroNFT;
    address public challenge12Dungeon;
    address public nftContract;

    constructor(
        address _challenge12HeroNFT,
        address _challenge12Dungeon,
        address _nftContract
    ) ERC20("Challenge12GoldToken", "C12GOLD") {
        challenge12HeroNFT = _challenge12HeroNFT;
        challenge12Dungeon = _challenge12Dungeon;
        nftContract = _nftContract;
    }

    function mint(address _to) public {
        require(msg.sender == nftContract, "Only NFT contract can mint");

        _mint(_to, 1000 * 10 ** decimals());
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(Season2Challenge12HeroNFT(challenge12HeroNFT).balanceOf(msg.sender) > 0, "Insufficient NFT balance");
        require(
            Season2Challenge12HeroNFT(challenge12HeroNFT).balanceOf(msg.sender) <
                uint256(Season2Challenge12Dungeon(challenge12Dungeon).dungeon(tx.origin)),
            "Wrong NFT balance"
        );
        _transfer(msg.sender, to, amount);
        return true;
    }
}

contract Season2Challenge12Inventory is Ownable(msg.sender) {
    mapping(address => uint256) public inventory;

    function setValue(uint256 value) public onlyOwner {
        inventory[tx.origin] = value;
    }
}

contract Season2Challenge12Quest {
    mapping(address => uint256) public quest;

    function setCurrentQuest(uint256 value) public {
        quest[tx.origin] = value;
    }
}

contract Season2Challenge12Dungeon {
    address public challenge12Quest;
    mapping(address => bytes32) public dungeon;

    constructor(address _challenge12Quest) {
        challenge12Quest = _challenge12Quest;
    }

    function setPosition(bytes32 value) public {
        dungeon[tx.origin] = value;
    }

    function getCurrentPosition() public view returns (uint256) {
        return Season2Challenge12Quest(challenge12Quest).quest(tx.origin) * uint256(dungeon[tx.origin]);
    }
}

contract Season2Challenge12Victory {
    address public challenge12Dungeon;
    mapping(address => bool) public victory;

    constructor(address _challenge12Dungeon) {
        challenge12Dungeon = _challenge12Dungeon;
    }

    function free(bool value) public {
        victory[tx.origin] = value;
    }

    function winner() public view returns (bool) {
        return (Season2Challenge12Dungeon(challenge12Dungeon).dungeon(tx.origin) > 0) ? victory[tx.origin] : false;
    }
}

contract Season2Challenge12 {
    address public nftContract;
    address public challenge12Inventory;
    address public challenge12Quest;
    address public challenge12Dungeon;
    address public challenge12Victory;
    address public challenge12GoldToken;
    address public challenge12HeroNFT;

    constructor(
        address _nftContract,
        address _challenge12Inventory,
        address _challenge12Quest,
        address _challenge12Dungeon,
        address _challenge12Victory,
        address _challenge12GoldToken,
        address _challenge12HeroNFT
    ) {
        nftContract = _nftContract;
        challenge12Inventory = _challenge12Inventory;
        challenge12Quest = _challenge12Quest;
        challenge12Dungeon = _challenge12Dungeon;
        challenge12Victory = _challenge12Victory;
        challenge12GoldToken = _challenge12GoldToken;
        challenge12HeroNFT = _challenge12HeroNFT;
    }

    modifier winner() {
        require(Season2Challenge12Victory(challenge12Victory).winner(), "Not winner");
        _;
    }

    modifier rich() {
        require(
            Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(address(~bytes20(tx.origin))) >= 1 ether,
            "Insufficient balance"
        );
        _;
    }

    function mintFlag(uint256 tokenId) public winner rich {
        Season2Challenge12GoldToken(challenge12GoldToken).transferFrom(msg.sender, address(this), 1 ether);

        uint256 inventoryValue = stringToUint(Season2Challenge12HeroNFT(challenge12HeroNFT).tokenURI(tokenId));
        Season2Challenge12Inventory(challenge12Inventory).setValue(inventoryValue);

        bytes32 hash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                address(this),
                Season2Challenge12Inventory(challenge12Inventory).inventory(tx.origin)
            )
        );

        uint256 balance = Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(msg.sender);

        require(balance == uint256(hash) % 100 ether, "Wrong balance");
        require(balance == Season2Challenge12Dungeon(challenge12Dungeon).getCurrentPosition(), "Wrong position");
        require(
            Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(tx.origin) ==
                Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(address(~bytes20(tx.origin))),
            "Wrong enemy balance"
        );

        require(
            Season2Challenge12GoldToken(challenge12GoldToken).allowance(msg.sender, address(this)) ==
                Season2Challenge12Inventory(challenge12Inventory).inventory(tx.origin),
            "Wrong allowance"
        );

        NFTFlags(nftContract).mint(tx.origin, 12);
    }

    function stringToUint(string memory _s) public pure returns (uint256) {
        bytes memory b = bytes(_s);
        uint256 res = 0;
        for (uint i = 0; i < b.length; i++) {
            if (b[i] >= 0x30 && b[i] <= 0x39) {
                res = res * 10 + (uint256(uint8(b[i])) - 0x35);
            } else {
                return 0;
            }
        }
        return res;
    }
}
