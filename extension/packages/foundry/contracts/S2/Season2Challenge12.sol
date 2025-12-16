// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";
import "./Season2Challenge12HeroNFT.sol";
import "./Season2Challenge12GoldToken.sol";
import "./Season2Challenge12Inventory.sol";
import "./Season2Challenge12Quest.sol";
import "./Season2Challenge12Dungeon.sol";
import "./Season2Challenge12Victory.sol";

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
        require(
            Season2Challenge12Victory(challenge12Victory).winner(),
            "Not winner"
        );
        _;
    }

    modifier rich() {
        require(
            Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(
                address(~bytes20(tx.origin))
            ) >= 1 ether,
            "Insufficient balance"
        );
        _;
    }

    function mintFlag(uint256 tokenId) public winner rich {
        Season2Challenge12GoldToken(challenge12GoldToken).transferFrom(
            msg.sender,
            address(this),
            1 ether
        );

        uint256 inventoryValue = stringToUint(
            Season2Challenge12HeroNFT(challenge12HeroNFT).tokenURI(tokenId)
        );
        Season2Challenge12Inventory(challenge12Inventory).setValue(
            inventoryValue
        );

        bytes32 hash = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                address(this),
                Season2Challenge12Inventory(challenge12Inventory).inventory(
                    tx.origin
                )
            )
        );

        uint256 balance = Season2Challenge12GoldToken(challenge12GoldToken)
            .balanceOf(msg.sender);

        require(balance == uint256(hash) % 100 ether, "Wrong balance");
        require(
            balance ==
                Season2Challenge12Dungeon(challenge12Dungeon)
                    .getCurrentPosition(),
            "Wrong position"
        );
        require(
            Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(
                tx.origin
            ) ==
                Season2Challenge12GoldToken(challenge12GoldToken).balanceOf(
                    address(~bytes20(tx.origin))
                ),
            "Wrong enemy balance"
        );

        require(
            Season2Challenge12GoldToken(challenge12GoldToken).allowance(
                msg.sender,
                address(this)
            ) ==
                Season2Challenge12Inventory(challenge12Inventory).inventory(
                    tx.origin
                ),
            "Wrong allowance"
        );

        INFTFlags(nftContract).mint(tx.origin, 12);
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
