![BuidlGuidl CTF - Devcon](./packages/nextjs/public/readme-image.jpg?raw=true)

**Welcome to the BuidlGuidl CTF - Devcon SEA 2024!**

⚡️ Live at https://ctf.buidlguidl.com/

**The goal of this CTF game is to mint as many NFT flags as possible from the `NFTFlags.sol` contract**. The allowed minters are each of the challenge contracts. Each flag gives you 100 points. We only track NFT minters, not NFT holders (i.e. transfers are not computed into the score).

This repository was built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and it contains **all the tools that you need to play (& win!) the CTF**. But you can also hack with your own stack.

---

In this repo we provide a full set of tools to help you with the challenges, including:

- A user-friendly frontend to interact with the contracts (`/debug` page)
- Simplified workflow for [deploying new contracts](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts)
- A local blockchain and a block explorer for testing.
- [Example scripts](./packages/scripts/src/example.ts) to interact with smart contracts via scripts.

## Setting up the environment

### Requirements

You'll need to have the following tools installed in your machine:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Foundry](https://book.getfoundry.sh/)

### Setting up your local testing environment

First, you'll need to clone this repository and install dependencies:

```
git clone -b foundry https://github.com/buidlguidl/ctf-devcon.git
cd ctf-devcon
yarn install
forge install --root packages/foundry
```

> **Note for Windows users**. Foundryup is not currently supported by Powershell or Cmd, and has issues with Git Bash. You will need to use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) as your terminal.

Now you will run the following commands in separate terminals:

1. Run a local blockchain:

```
yarn chain
```

2. Deploy the challenges contracts locally:

```
yarn deploy --file DeployChallenges.s.sol
```

> Note: This command will update the `deployedContracts.ts` file (in the `scripts` and `nextjs` packages), which contains the deployed contracts addresses and ABIs.

3. Start Ponder (event indexer):

```
yarn ponder:dev
```

> Note: This just runs the ponder indexer locally, which is used to keep track of all the events happening in the blockchain.

4. Start the frontend (NextJS app):

```
yarn start
```

Now your app on `http://localhost:3000` is running entirely locally. You can break things without any consequences :)

## Repo structure / Key files

This is a [yarn](https://yarnpkg.com/features/workspaces) monorepo with different packages:

```
ctf-devcon/
└── packages/
    ├── foundry/
    ├── nextjs/
    ├── scripts/
    └── ponder/
```

### foundry

Comes preconfigured with [Foundry](https://book.getfoundry.sh/) development environment and contains the smart contracts and deployment scripts for the CTF challenges.

#### Key files in foundry

- `contracts/`: The source directory where all your smart contracts should be. It already contains all the challenge contracts and the NFT Flag minter contract.
- `script/`: This directory contains all your deployments scripts. When you run `yarn deploy` it defaults to `Deploy.s.sol`, but you can also deploy any other script from this directory (e.g., `yarn deploy --file DeploySolution2.s.sol`).

<details>
<summary>Example (How to deploy your solution contracts)</summary>

1. Create the smart contract:

   - Add your new contract file (e.g., `Challenge2Solution.sol`) in the `packages/foundry/contracts/` directory.

2. Create a deployment script:

   - Add a new file (or use the already created `DeploySolution2.s.sol` file as a starting point) in the `script/` directory.
   - Write your deployment script as needed (you can use `DeployChallenges.s.sol` to guide you)

3. Deploy your contract locally:

   - Run `yarn deploy --file DeploySolution2.s.sol` to deploy your solution contract locally. `yarn deploy` by default runs `Deploy.s.sol` which is useful when deploying multiple solutions at once. Use the `--file` flag when you want to deploy a specific solution

4. When tested and ready, deploy your contract to Optimism (ask us for some funds if you need!):

   - > Note: You need a foundry keystore account to deploy. Either:

     - Generate with random private key: Run `yarn generate` and update `ETH_KEYSTORE_ACCOUNT=scaffold-eth-custom` in `packages/foundry/.env`.
     - Create one with existing private key: Run `yarn account:import`, enter your private key, and update `ETH_KEYSTORE_ACCOUNT=scaffold-eth-custom` in `packages/foundry/.env`.

   - > TIP: You can check configured account balance with `yarn account`.

   - Run `yarn deploy --file DeploySolution2.s.sol --network optimism` to deploy your solution contract to Optimism.

   For more details on deployment, including configuring deployer accounts or the network you want to deploy to, see the [Scaffold-ETH 2 foundry deployment](https://github.com/scaffold-eth/scaffold-eth-2/tree/foundry?tab=readme-ov-file#deploying-to-live-networks).

</details>

### NextJS

This is the frontend of the game. Main pages:

- _"Profile"_ shows the team profile and the flags they have minted.
- _"Challenges"_ shows the Challenges descriptions, Goals and Hints.
- _"Leaderboard"_ shows the current top teams in the game.
- _"Debug Contracts"_ lists all the deployed contracts and allows you to interact with them.

Key folders and files:

- `app/`: Contains the Next.js pages and components (uses [app router](https://nextjs.org/docs/app)).
- `contracts/`: Contains deployed contracts ABIs and addresses.
- `package.json`: Dependencies and scripts for the Next.js app.
- `scaffold.config.ts`: Configuration file, you can check the different settings in our [docs](https://docs.scaffoldeth.io/deploying/deploy-nextjs-app#scaffold-app-configuration)

### scripts

Contains scripts to interact with the deployed contracts. This package comes pre-installed with [viem](https://viem.sh/)
which helps you interface with the Blockchain using Typescript scripts.

#### Key files and directories:

- `src/`: Contains the script files.
  - `example.ts`: A basic example script demonstrating how to interact with contracts.
- `contracts/`: Contains deployed contracts ABIs and addresses. (generated by `yarn deploy`)

To run scripts, navigate to the scripts package and run the script using `yarn tsx`:

```shell
cd packages/scripts
yarn tsx src/example.ts
```

- You can copy your PK for the deployer account with and fill the `.env` file with your own PK to run the transactions.
- Check the `TARGET_CHAIN` variable in the example script to see how to deploy to the live network. (default is localhost)

### Ponder

No need to take a look here, since it's not part of the game. Just the indexer we use to keep track of all the contract events happening.
