// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Season2Challenge12HeroNFT.sol";
import "./Season2Challenge12Dungeon.sol";

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

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(
            Season2Challenge12HeroNFT(challenge12HeroNFT).balanceOf(
                msg.sender
            ) > 0,
            "Insufficient NFT balance"
        );
        require(
            Season2Challenge12HeroNFT(challenge12HeroNFT).balanceOf(
                msg.sender
            ) <
                uint256(
                    Season2Challenge12Dungeon(challenge12Dungeon).dungeon(
                        tx.origin
                    )
                ),
            "Wrong NFT balance"
        );
        _transfer(msg.sender, to, amount);
        return true;
    }
}
