![BuidlGuidl CTF - Devcon](./packages/nextjs/public/readme-image.jpg?raw=true)

Welcome to the BuidlGuidl CTF - Devcon SEA 2024!

**The goal of this CTF game is to mint as many NFT flags as possible from the `NFTFlags.sol` contract, which is deployed** [here](https://TODO-add-basescan-url-to-contract/). Each flag gives you 100 points. We only track NFT minters, not NFT holders (i.e. transfers are not computed into the score).

This repository was built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and it contains 2 things:

- The website with the challenges, which is live at https://ctf-devcon.buidlguidl.com/
- All the tools that you need to play (& win!) the CTF.

You can choose to hack with your own stack, or use this repo as your hacking environment.

### Hack with your own stack

Go directly to https://ctf-devcon.buidlguidl.com/ and start hacking.

You can also find:

1. Challenge details in the [`packages/nextjs/data/challenges`](./packages/nextjs/data/challenges) directory.
2. Explore the smart contracts in either Foundry or Hardhat:
   - Foundry: [`packages/foundry/contracts/`](./packages/foundry/contracts/)
   - Hardhat: [`packages/hardhat/contracts/`](./packages/hardhat/contracts/)

### Hack using this repo

In this repo we provide a full set of tools to help you with the challenges, including:

- A user-friendly frontend to interact with the contracts (_"Debug Contracts"_ page)
- Simplified workflow for [deploying new contracts](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts)
- A local blockchain and a block explorer for testing
- [Example scripts](./packages/scripts/src/example.ts) to interact with smart contracts

## Setting up the environment

### Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Set the live site in your local environment

First, we'll set up the live site in your local environment.

1. Clone the repository and install dependencies:

```
git clone https://github.com/buidlguidl/ctf-devcon.git
cd ctf-devcon
yarn install
```

2. Start the frontend:

```
yarn start
```

You can visit the website at http://localhost:3000.

This will just be a copy of the live site (pointing at the live contracts) running on your computer. If you want (you should!) to hack & test the challenges locally, follow the steps below.

### Set up your local testing environment

1. Run a local blockchain:

```
yarn chain
```

2. Deploy the contracts locally:

```
yarn deploy
```

> TIP: This command will update the `deployedContracts.ts` file (in the `scripts` and `nextjs` packages), which contains the deployed contracts addresses and ABIs.

3. Start Ponder (event indexer):

```
yarn ponder:dev
```

4. Start your NextJS app:

First, go to `scaffold.config.ts` and set `targetNetworks` to use `[chains.hardhat]`. And then run:

```
yarn start
```

Now your app on `http://localhost:3000` is running entirely locally. You can break things without any consequences :)

## Repo structure / Key files

This is a [yarn](https://yarnpkg.com/features/workspaces) monorepo with different packages:

```
ctf-devcon/
└── packages/
    ├── hardhat/
    ├── foundry/
    ├── nextjs/
    ├── scripts/
    └── ponder/
```

### hardhat

Comes preconfigured with [hardhat](https://hardhat.org/) and contains the smart contracts and deployment scripts for the CTF challenges.

It uses hardhat-deploy to deploy the contracts.

#### Key files in hardhat

- `contracts/`: The source directory where all your smart contracts should be. It already contains all the challenge contracts and the NFT Flag minter contract.
- `deploy/`: This directory contains all your deployments scripts. When you run `yarn deploy` all the scripts present in this directory will be executed in numbered order.

<details>
<summary>Example (How to deploy your solution contracts)</summary>

1. Create a smart contract:

   - Add your new contract file (e.g., `Challenge3Solution.sol`) in the `contracts/` directory.

2. Create a deployment script:

   - Add a new file (e.g., `01_deploy_solutions.ts`) in the `deploy/` directory.
   - Write your deployment script, you can use `00_deploy_your_contract.ts` to guide you.

3. Deploy your contract:
   - Run `yarn deploy` to deploy your contract.

For more details on deployment, including configuring deployer accounts or the network you want to deploy to, see the [Scaffold-ETH 2 deployment docs](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts).

</details>

### foundry

Comes preconfigured with [Foundry](https://book.getfoundry.sh/) development environment and contains the smart contracts and deployment scripts for the CTF challenges.

#### Key files in foundry

- `contracts/`: The source directory where all your smart contracts should be. It already contains all the challenge contracts and the NFT Flag minter contract.
- `script/`: Deployment scripts for the contracts.

<details>
<summary>Example (How to deploy your solution contracts)</summary>

1. Create a deployment script:

   - Add a new file (e.g., `ChallengesSolutions.s.sol`) in the `script/` directory.
   - Write your deployment script, following examples in `DeployChallenges.s.sol`.

2. Update the main deployment script:

   - Open `Deploy.s.sol` in the `script/` directory.
   - Import your `ChallengesSolutions.s.sol`.
   - Add the deployment of your solutions in the `run()` function.

3. Deploy your contracts:
   - Run `yarn deploy` to deploy your contracts.

For more details on deployment, including configuring deployer accounts or the network you want to deploy to, see the [Scaffold-ETH 2 deployment docs](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts).

</details>

### nextjs

This is the frontend of the game. Main pages:

- _"Challenges"_ shows the Challenges descriptions, Goals and Hints.
- _"Leaderboard"_ shows the current top players in the game.
- _"Debug Contracts"_ lists all the deployed contracts and allows you to interact with them.
- _"Profile"_ shows your player profile and the flags you have minted.

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
- `contracts/`: Contains deployed contracts ABIs and addresses.

To run scripts, navigate to the scripts package and run the script using `yarn tsx`:

```shell
cd packages/scripts
yarn tsx src/example.ts
```

You can create your own scripts in the `src/` directory to interact with specific challenge contracts or perform custom operations.

### ponder

No need to take a look here, since it's not part of the game. Just the indexer we use to keep track of all the contract events happening
