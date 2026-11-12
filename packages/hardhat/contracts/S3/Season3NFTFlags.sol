//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../INFTFlags.sol";

interface ISeason3Challenge8 {
    function flagIdOf(address player) external view returns (uint256);
}

contract Season3NFTFlags is ERC721, Ownable, IERC721Receiver {
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    event Enabled(address indexed caller);
    event Disabled(address indexed caller);

    EnumerableSet.AddressSet private _allowedMinterSet;
    uint256 public tokenIdCounter;
    mapping(uint256 => uint256) public tokenIdToChallengeId;
    mapping(address => mapping(uint256 => bool)) public hasMinted;
    bool public enabled = false;
    uint256 public enabledAt;
    address public season1NFTFlags;
    address public challenge8;
    mapping(address => bool) public finalBossUnlocked;

    string[30] public flagColors = [
        "#4b5563", // Default Gray
        "#dc2626", // Red
        "#ea580c", // Orange
        "#d97706", // Amber
        "#ca8a04", // Yellow
        "#65a30d", // Lime
        "#16a34a", // Green
        "#059669", // Emerald
        "#0d9488", // Teal
        "#0891b2", // Cyan
        "#0284c7", // Sky
        "#2563eb", // Blue
        "#4f46e5", // Indigo
        "#7c3aed", // Violet
        "#9333ea" // Purple
    ];

    event FlagMinted(address indexed minter, uint256 indexed tokenId, uint256 indexed challengeId);
    event FlagSacrificed(address indexed player, uint256 indexed tokenId);
    event Challenge8Linked(address indexed challenge8);

    constructor(
        address _initialOwner,
        address _season1NFTFlags
    ) Ownable(_initialOwner) ERC721("BG-CTF-Season3", "CTF-S3") {
        season1NFTFlags = _season1NFTFlags;
    }

    function mint(address _recipient, uint256 _challengeId) external {
        require(allowedMinters(msg.sender), "Not allowed to mint");
        _mintToken(_recipient, _challengeId);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external view override returns (bytes4) {
        require(msg.sender == address(this), "Only flags sent to this contract");
        return this.onERC721Received.selector;
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (to != address(this)) {
            return from;
        }

        require(challenge8 != address(0), "Challenge 8 is not linked");
        require(tokenIdToChallengeId[tokenId] == 10, "Not a challenge 10 flag");
        require(hasMinted[from][10], "Sender did not mint flag 10");
        require(ISeason3Challenge8(challenge8).flagIdOf(from) == tokenId, "Flag id not registered");

        finalBossUnlocked[from] = true;
        _transfer(address(this), from, tokenId);
        emit FlagSacrificed(from, tokenId);

        return from;
    }

    function _mintToken(address _recipient, uint256 _challengeId) internal {
        require(enabled, "Minting is not enabled");
        require(INFTFlags(season1NFTFlags).hasMinted(_recipient, 1), "User address is not registered in Season 1");
        require(!hasMinted[_recipient][_challengeId], "User address has already minted for this challenge");

        tokenIdCounter++;
        uint256 newTokenId = tokenIdCounter;
        _mint(_recipient, newTokenId);
        tokenIdToChallengeId[newTokenId] = _challengeId;
        hasMinted[_recipient][_challengeId] = true;
        emit FlagMinted(_recipient, newTokenId, _challengeId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");

        string memory svg = generateSVG(tokenId);
        uint256 challengeId = tokenIdToChallengeId[tokenId];
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Challenge #',
                        challengeId.toString(),
                        " flag (tokenId = ",
                        tokenId.toString(),
                        ")",
                        '", "description": "A NFT flag for the BuidlGuidl CTF at Devcon Mumbai 2026", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function generateSVG(uint256 tokenId) internal view returns (string memory) {
        uint256 challengeId = tokenIdToChallengeId[tokenId];
        string memory fillColor = flagColors[challengeId];

        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 461 573"><path fill="#292524" fill-rule="evenodd" d="m292.296 11.388-34.773-9.317-2.071 7.727-7.727-2.07-6.988 26.08 7.727 2.07-67.81 253.073 7.727 2.07 29.764-111.081 19.319 5.176-29.765 111.081 7.728 2.071 31.835-118.809 8.693 2.33-2.071 7.727 25.114 6.729 2.071-7.727 24.148 6.47 2.071-7.727 17.386 4.659 2.071-7.728 32.841 8.8-2.07 7.727 17.387 4.659-2.071 7.728 31.876 8.541 6.729-25.114-7.728-2.071 8.8-32.841-7.727-2.071 6.988-26.08 7.727 2.071 4.918-18.353 10.625 2.847 2.071-7.727 7.727 2.07 4.4-16.42-16.421-4.4 2.071-7.728-17.387-4.659 2.071-7.727-49.262-13.2-2.071 7.728-26.08-6.989-2.071 7.728-16.42-4.4-2.071 7.727-17.387-4.659 2.071-7.727-25.114-6.73 2.07-7.727 7.728 2.071 6.988-26.08-7.727-2.07 2.07-7.728Zm-2.07 7.727-6.989 26.08-34.773-9.317 6.988-26.08 34.774 9.317ZM304.21 67.38l-25.114-6.729-29.764 111.082 8.694 2.329-2.071 7.728 25.114 6.729 2.071-7.728 24.148 6.471 2.07-7.728 17.387 4.659 2.071-7.727 32.841 8.8-2.071 7.727 17.387 4.659-2.07 7.727 24.148 6.471 4.658-17.387-7.727-2.071 8.8-32.841-7.728-2.071 6.989-26.08 7.727 2.071 4.918-18.353 7.727 2.071 2.071-7.727 10.625 2.847 2.329-8.694-8.693-2.329 2.07-7.728-17.386-4.658 2.07-7.728-49.262-13.2-2.071 7.728-26.08-6.988-2.07 7.727-16.421-4.4-2.07 7.728-17.387-4.659 2.07-7.728Zm-64.676 110.01L273.44 50.852l-19.319-5.176-33.905 126.536 19.318 5.177Z" clip-rule="evenodd"/><path fill="#AC8E4C" d="m290.226 19.115-6.989 26.08-34.773-9.317 6.988-26.08 34.774 9.317Z"/><path fill="',
                    fillColor,
                    '" d="m254.121 45.676 19.319 5.176-33.906 126.537-19.318-5.177 33.905-126.536Z"/><path fill="#AA8B48" d="m218.145 179.94 19.319 5.176-29.765 111.081-19.318-5.176 29.764-111.081Z"/><path fill="',
                    fillColor,
                    '" d="m417.501 81.171-49.262-13.2-2.071 7.728-26.08-6.988-2.07 7.727-16.421-4.4-2.07 7.728-17.387-4.659 2.07-7.728-25.114-6.729-29.764 111.082 8.694 2.329-2.071 7.728 25.114 6.729 2.071-7.728 24.148 6.471 2.07-7.728 17.387 4.659 2.071-7.727 32.841 8.8-2.071 7.727 17.387 4.659-2.07 7.727 24.148 6.471 4.658-17.387-7.727-2.071 8.8-32.841-7.728-2.071 6.989-26.08 7.727 2.071 4.918-18.353 7.727 2.071 2.071-7.727 10.625 2.847 2.329-8.694-8.693-2.329 2.07-7.728-17.386-4.658 2.07-7.728Z"/><text transform="rotate(15 -157.214 1272.167)" fill="#fff" xml:space="preserve" style="white-space:pre" font-family="Courier New" font-size="80" font-weight="bold" text-anchor="middle">',
                    '<tspan x="20" y="62.578">',
                    challengeId.toString(),
                    "</tspan>",
                    '</text><path fill="#74ABDF" d="M147.926 177h8v16h8v16h8v8h8v17h8v16h8v16h8v15h8v9h8v16h8v16h8v8h8v17h8v16h8v8h-8v8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-24v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-8v-8h8v-16h8v-17h8v-8h8v-16h8v-16h8v-9h8v-15h8v-16h8v-16h8v-17h8v-8h8v-16h8v-16h8v-16h8v16Z"/><path fill="#FF85A7" d="M27.926 395v8h8v8h8v16h8v8h8v8h8v16h8v9h8v16h8v8h8v16h8v8h8v16h8v8h8v16h8v13h8v-13h8v-16h8v-8h8v-16h8v-8h8v-16h8v-8h8v-16h8v-9h8v-16h8v-8h8v-8h8v-16h8v-8h8v-8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-8v9h-24v-9h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8Z"/><path fill="#38384E" fill-rule="evenodd" d="M127.926 447v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-8v-16h8v-16h8v-17h8v-8h8v-16h8v-16h8v-9h8v-15h8v-16h8v-16h8v-17h8v-8h8v-16h8v-16h8v-16h16v16h8v16h8v16h8v8h8v17h8v16h8v16h8v15h8v9h8v16h8v16h8v8h8v17h8v16h8v16h-8v8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-8v8h8v-8h16v-8h8v-8h16v-8h8v-8h16v-8h16v16h-8v8h-8v16h-8v8h-8v8h-8v16h-8v9h-8v16h-8v8h-8v16h-8v8h-8v16h-8v8h-8v16h-8v13h-16v-13h-8v-16h-8v-8h-8v-16h-8v-8h-8v-16h-8v-8h-8v-16h-8v-9h-8v-16h-8v-8h-8v-8h-8v-16h-8v-8h-8v-16h16v8h16v8h8v8h16v8h8v8h16v8h8v8h16Zm20-286v16h8v16h8v16h8v8h8v17h8v16h8v16h8v15h8v9h8v16h8v16h8v8h8v17h8v16h8v8h-8v8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-8v8h-16v8h-24v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-16v-8h-8v-8h-8v-8h8v-16h8v-17h8v-8h8v-16h8v-16h8v-9h8v-15h8v-16h8v-16h8v-17h8v-8h8v-16h8v-16h8v-16h8Zm12 286v-8h16v8h-16Zm-32 0h32v8h-8v9h-16v-9h-8v-8Zm12 122v-13h-8v-16h-8v-8h-8v-16h-8v-8h-8v-16h-8v-8h-8v-16h-8v-9h-8v-16h-8v-8h-8v-8h-8v-16h-8v-8h16v8h8v8h16v8h8v8h16v8h8v8h16v8h8v9h24v-9h8v-8h16v-8h8v-8h16v-8h8v-8h16v-8h8v-8h16v8h-8v16h-8v8h-8v8h-8v16h-8v9h-8v16h-8v8h-8v16h-8v8h-8v16h-8v8h-8v16h-8v13h-8Zm112-166v-8h8v8h-8Zm-216 0h-8v-8h8v8Z" clip-rule="evenodd"/><path fill="#000" d="M13.701 355.416 0 347.648l6.658-11.744 1.957 1.11 1.11-1.958 3.915 2.22-1.11 1.957 1.957 1.11 1.11-1.958 3.915 2.22-1.11 1.957 1.957 1.11-6.658 11.744Zm-5.61-8.354 3.33-5.872-3.915-2.219-3.33 5.872 3.915 2.219Zm5.872 3.329 3.33-5.872-3.915-2.219-3.33 5.872 3.915 2.219ZM23.812 337.582l-1.958-1.11-1.11 1.958-7.829-4.439 2.22-3.915 7.829 4.439 3.329-5.872-7.83-4.439 2.22-3.914 9.787 5.548-6.658 11.744ZM22.055 313.308l-1.958-1.11 2.22-3.914 1.957 1.109-2.22 3.915Zm9.524 10.573-1.957-1.11 2.22-3.915-5.873-3.329-1.11 1.958-1.957-1.11 3.33-5.872 7.828 4.439 2.22-3.915 1.957 1.11-6.658 11.744ZM40.456 308.222l-1.957-1.11-1.11 1.958-5.872-3.329 1.11-1.958-1.957-1.109 4.438-7.83-3.914-2.219 2.22-3.915 13.7 7.768-6.657 11.744Zm-.847-3.067 3.329-5.872-5.872-3.329-3.33 5.872 5.873 3.329ZM48.532 293.977l-1.957-1.109 2.22-3.915-9.788-5.548-1.11 1.957-1.956-1.11 3.328-5.872 11.745 6.658 2.219-3.914 1.957 1.109-6.658 11.744ZM58.458 276.47l-1.958-1.11-1.11 1.957-1.957-1.109-1.11 1.957-5.871-3.329 1.11-1.957-1.958-1.11 1.11-1.957-1.958-1.11 5.549-9.786 1.957 1.109-4.439 7.83 1.958 1.109-1.11 1.958 5.872 3.328 1.11-1.957 1.957 1.11 2.22-3.915-3.915-2.219-1.11 1.957-1.957-1.109 3.329-5.872 7.829 4.438-5.548 9.787ZM66.472 262.334l-1.957-1.11-1.11 1.957-7.83-4.438 2.22-3.915 7.83 4.439 3.328-5.872-7.83-4.439 2.22-3.915 9.787 5.549-6.658 11.744ZM64.838 237.842l-1.957-1.11 2.22-3.914 1.957 1.109-2.22 3.915Zm9.525 10.573-1.957-1.11 2.219-3.915-5.872-3.329-1.11 1.958-1.957-1.11 3.329-5.872 7.83 4.439 2.219-3.915 1.957 1.11-6.658 11.744ZM83.24 232.756l-1.957-1.11-1.11 1.958-5.872-3.329 1.11-1.958-1.957-1.109 4.438-7.83-3.915-2.219 2.22-3.915 13.701 7.768-6.658 11.744Zm-.848-3.067 3.33-5.872-5.873-3.329-3.329 5.872 5.872 3.329ZM91.131 218.837l-1.957-1.109 2.219-3.915-9.787-5.548-1.11 1.957-1.957-1.11 3.33-5.872 11.743 6.658 2.22-3.914 1.957 1.109-6.658 11.744ZM104.694 194.914l-1.958-1.109-1.109 1.957-1.958-1.11-1.11 1.958-5.871-3.329 1.11-1.958-1.958-1.109 1.11-1.958-1.958-1.109 4.439-7.83 1.957 1.11 1.11-1.957 1.957 1.109-2.22 3.915-1.956-1.11-2.22 3.915 1.958 1.11-1.11 1.957 5.872 3.329 1.11-1.957 1.957 1.109 2.219-3.914-1.957-1.11 2.219-3.915 1.958 1.11-1.11 1.957 1.957 1.11-4.438 7.829ZM113.571 179.256l-11.744-6.658-2.22 3.914-1.957-1.109 6.658-11.744 1.958 1.109-2.22 3.915 11.744 6.658-2.219 3.915ZM119.119 169.469l-13.701-7.768L113.185 148l1.958 1.11-5.549 9.786 3.915 2.22 4.439-7.83 1.957 1.11-4.439 7.829 5.872 3.329-2.219 3.915Z"/><path fill="#fff" d="M141.333 299h-10.666v16h-5.334v5.333h-10.666V315h-5.334v-16H88v80h37.333v-37.333h5.334v-5.334H136V331h16v5.333h5.333v5.334h5.334V379H200v-80h-21.333v16h-5.334v5.333h-10.666V315h-5.334v-16h-16Z"/></svg>'
                )
            );
    }

    function addAllowedMinterMultiple(address[] calldata minters) external onlyOwner {
        for (uint256 i = 0; i < minters.length; i++) {
            _setAllowedMinter(minters[i], true);
        }
    }

    function addAllowedMinter(address minter) external onlyOwner {
        _setAllowedMinter(minter, true);
    }

    function removeAllowedMinter(address minter) external onlyOwner {
        _setAllowedMinter(minter, false);
    }

    function removeAllowedMinterMultiple(address[] calldata minters) external onlyOwner {
        for (uint256 i = 0; i < minters.length; i++) {
            _setAllowedMinter(minters[i], false);
        }
    }

    function getAllowedMinters() external view returns (address[] memory) {
        return _allowedMinterSet.values();
    }

    function allowedMinters(address minter) public view returns (bool) {
        return _allowedMinterSet.contains(minter);
    }

    function _setAllowedMinter(address minter, bool allowed) internal {
        if (allowed) {
            _allowedMinterSet.add(minter);
        } else {
            _allowedMinterSet.remove(minter);
        }
    }

    function setChallenge8(address _challenge8) external onlyOwner {
        challenge8 = _challenge8;
        emit Challenge8Linked(_challenge8);
    }

    function enable() external onlyOwner {
        enabled = true;
        enabledAt = block.timestamp;

        emit Enabled(msg.sender);
    }

    function disable() external onlyOwner {
        enabled = false;

        emit Disabled(msg.sender);
    }
}
