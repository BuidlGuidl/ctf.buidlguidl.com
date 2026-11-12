// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season3Challenge12 {
    enum Account {
        PLAYER,
        AMM,
        VAULT,
        MARKET,
        NPC
    }

    enum Token {
        WETH,
        USD
    }

    struct World {
        bool entered;
        bool npcDeposited;
        uint256 totalShares;
        uint256 debt;
    }

    uint256 public constant FEE_BPS = 30;
    uint256 public constant LTV_BPS = 8000;
    uint256 public constant BPS = 10000;
    uint256 public constant MARKET_LIQUIDITY = 1_000_000 ether;
    uint256 public constant NPC_DEPOSIT = 15 ether;
    uint256 public constant MAX_MARKET_LEFT = 1_000 ether;

    address public nftContract;

    mapping(address => World) public worlds;
    mapping(address => mapping(Account => mapping(Token => uint256))) private _balances;
    mapping(address => mapping(Account => uint256)) private _shares;

    event Entered(address indexed player);
    event Swapped(address indexed player, Token tokenIn, uint256 amountIn, uint256 amountOut);
    event Deposited(address indexed player, Account indexed account, uint256 assets, uint256 shares);
    event Redeemed(address indexed player, uint256 shares, uint256 assets);
    event Borrowed(address indexed player, uint256 amount);
    event Repaid(address indexed player, uint256 amount);

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    modifier inWorld() {
        require(worlds[tx.origin].entered, "Enter first");
        _;
    }

    function enter() external {
        address p = tx.origin;
        for (uint256 a = 0; a <= uint256(Account.NPC); a++) {
            _balances[p][Account(a)][Token.WETH] = 0;
            _balances[p][Account(a)][Token.USD] = 0;
            _shares[p][Account(a)] = 0;
        }

        _balances[p][Account.PLAYER][Token.WETH] = 20 ether;
        _balances[p][Account.PLAYER][Token.USD] = 30_000 ether;
        _balances[p][Account.AMM][Token.WETH] = 10 ether;
        _balances[p][Account.AMM][Token.USD] = 20_000 ether;
        _balances[p][Account.MARKET][Token.USD] = MARKET_LIQUIDITY;
        _balances[p][Account.NPC][Token.WETH] = NPC_DEPOSIT;

        worlds[p] = World({ entered: true, npcDeposited: false, totalShares: 0, debt: 0 });
        emit Entered(p);
    }

    function balanceOf(address player, Account account, Token token) external view returns (uint256) {
        return _balances[player][account][token];
    }

    function sharesOf(address player, Account account) external view returns (uint256) {
        return _shares[player][account];
    }

    function transfer(Account to, Token token, uint256 amount) external inWorld {
        _move(tx.origin, Account.PLAYER, to, token, amount);
    }

    function spotPrice(address player) public view returns (uint256) {
        uint256 wethReserve = _balances[player][Account.AMM][Token.WETH];
        require(wethReserve > 0, "Empty pool");
        return (_balances[player][Account.AMM][Token.USD] * 1 ether) / wethReserve;
    }

    function getAmountOut(address player, Token tokenIn, uint256 amountIn) public view returns (uint256) {
        Token tokenOut = tokenIn == Token.WETH ? Token.USD : Token.WETH;
        uint256 reserveIn = _balances[player][Account.AMM][tokenIn];
        uint256 reserveOut = _balances[player][Account.AMM][tokenOut];
        uint256 amountInWithFee = amountIn * (BPS - FEE_BPS);
        return (amountInWithFee * reserveOut) / (reserveIn * BPS + amountInWithFee);
    }

    function swap(Token tokenIn, uint256 amountIn, uint256 minAmountOut) external inWorld returns (uint256 amountOut) {
        address p = tx.origin;
        Token tokenOut = tokenIn == Token.WETH ? Token.USD : Token.WETH;
        amountOut = getAmountOut(p, tokenIn, amountIn);
        require(amountOut > 0 && amountOut >= minAmountOut, "Insufficient output");

        _move(p, Account.PLAYER, Account.AMM, tokenIn, amountIn);
        _move(p, Account.AMM, Account.PLAYER, tokenOut, amountOut);
        emit Swapped(p, tokenIn, amountIn, amountOut);
    }

    function totalAssets(address player) public view returns (uint256) {
        return _balances[player][Account.VAULT][Token.WETH];
    }

    function convertToShares(address player, uint256 assets) public view returns (uint256) {
        uint256 supply = worlds[player].totalShares;
        return supply == 0 ? assets : (assets * supply) / totalAssets(player);
    }

    function convertToAssets(address player, uint256 shares) public view returns (uint256) {
        uint256 supply = worlds[player].totalShares;
        return supply == 0 ? shares : (shares * totalAssets(player)) / supply;
    }

    function deposit(uint256 assets) external inWorld returns (uint256) {
        return _deposit(tx.origin, Account.PLAYER, assets);
    }

    function processNpcDeposit() external inWorld returns (uint256) {
        address p = tx.origin;
        require(!worlds[p].npcDeposited, "NPC already deposited");
        worlds[p].npcDeposited = true;
        return _deposit(p, Account.NPC, NPC_DEPOSIT);
    }

    function redeem(uint256 shares) external inWorld returns (uint256 assets) {
        address p = tx.origin;
        assets = convertToAssets(p, shares);
        _shares[p][Account.PLAYER] -= shares;
        worlds[p].totalShares -= shares;
        _move(p, Account.VAULT, Account.PLAYER, Token.WETH, assets);
        emit Redeemed(p, shares, assets);
    }

    function supplyCollateral(uint256 shares) external inWorld {
        address p = tx.origin;
        _shares[p][Account.PLAYER] -= shares;
        _shares[p][Account.MARKET] += shares;
    }

    function withdrawCollateral(uint256 shares) external inWorld {
        address p = tx.origin;
        _shares[p][Account.MARKET] -= shares;
        _shares[p][Account.PLAYER] += shares;
        require(isHealthy(p), "Unhealthy position");
    }

    function collateralValue(address player) public view returns (uint256) {
        uint256 assets = convertToAssets(player, _shares[player][Account.MARKET]);
        return (assets * spotPrice(player)) / 1 ether;
    }

    function isHealthy(address player) public view returns (bool) {
        return worlds[player].debt * BPS <= collateralValue(player) * LTV_BPS;
    }

    function borrow(uint256 amount) external inWorld {
        address p = tx.origin;
        worlds[p].debt += amount;
        require(isHealthy(p), "Unhealthy position");
        _move(p, Account.MARKET, Account.PLAYER, Token.USD, amount);
        emit Borrowed(p, amount);
    }

    function repay(uint256 amount) external inWorld {
        address p = tx.origin;
        worlds[p].debt -= amount;
        _move(p, Account.PLAYER, Account.MARKET, Token.USD, amount);
        emit Repaid(p, amount);
    }

    function mintFlag() external inWorld {
        address p = tx.origin;
        require(worlds[p].npcDeposited, "NPC has not deposited");
        require(convertToAssets(p, _shares[p][Account.NPC]) == 0, "NPC still owns assets");
        require(_balances[p][Account.MARKET][Token.USD] <= MAX_MARKET_LEFT, "Market not drained");
        require(INFTFlags(nftContract).finalBossUnlocked(p), "Challenge 10 flag not sacrificed");

        INFTFlags(nftContract).mint(p, 12);
    }

    function _deposit(address p, Account account, uint256 assets) private returns (uint256 shares) {
        shares = convertToShares(p, assets);
        _move(p, account, Account.VAULT, Token.WETH, assets);
        _shares[p][account] += shares;
        worlds[p].totalShares += shares;
        emit Deposited(p, account, assets, shares);
    }

    function _move(address p, Account from, Account to, Token token, uint256 amount) private {
        _balances[p][from][token] -= amount;
        _balances[p][to][token] += amount;
    }
}
