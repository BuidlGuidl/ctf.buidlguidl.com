![BuidlGuidl CTF - Devcon](./packages/nextjs/public/readme-image.jpg?raw=true)

**Welcome to the BuidlGuidl CTF - Devcon SEA 2024!**

⚡️ Live at https://ctf.buidlguidl.com

**The goal of this CTF game is to mint as many NFT flags as possible from the `NFTFlags.sol` contract**. The allowed minters are each of the challenge contracts. Each flag gives you 100 points. We only track NFT minters, not NFT holders (i.e. transfers are not computed into the score).

This repository was built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and it contains **all the tools that you need to play (& win!) the CTF**. But you can also hack with your own stack.

---

In this repo we provide a full set of tools to help you with the challenges, including:

- A user-friendly frontend to interact with the contracts (`/debug` page)
- Simplified workflow for [deploying new contracts](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts)
- A local blockchain and a block explorer for testing.
- [Example scripts](./packages/scripts/src/example.ts) to interact with smart contracts via scripts.

> [!NOTE]
> If you prefer using Foundry for development, check out the [foundry branch](https://github.com/buidlguidl/ctf-devcon/tree/foundry).

## Setting up the environment

### Requirements

You'll need to have the following tools installed in your machine:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Setting up your local testing environment

First, you'll need to clone this repository and install dependencies:

```
git clone https://github.com/buidlguidl/ctf-devcon.git
cd ctf-devcon
yarn install
```

Now you will run the following commands in separate terminals:

1. Run a local blockchain:

```
yarn chain
```

2. Deploy the challenges contracts locally:

```
yarn deploy
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
    ├── hardhat/
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
<summary>Example (How to deploy a contract)</summary>

1. Create the smart contract:

   - Add your new contract file (e.g., `Challenge2Solution.sol`) in the `packages/hardhat/contracts/` directory.

2. Create a deployment script:

   - Add a new file (or use the already created `02_deploy_challenge_2_solution.ts` file as a starting point) in the `deploy/` directory.
   - Write your deployment script as needed (you can use `00_deploy_your_contract.ts` to guide you)

3. Deploy your contract locally:

   - Run `yarn deploy --tags solution2` to deploy your solution contract locally. The `tags` make sure that your are only deploying the solution contract and not all the other challenges (that were deployed with `yarn deploy` or `yarn deploy --tags CTF`).

4. When tested and ready, deploy your contract to Optimism (ask us for some funds if you need!):
   - > Note: You need a private key to deploy the contracts. You can generate one with `yarn generate` or add your own private key in the `.env` files in `/packages/hardhat` and `packages/scripts` folders.
   - Run `yarn deploy --tags solution2 --network optimism` to deploy your solution contract to Optimism.

For more details on deployment, including configuring deployer accounts or the network you want to deploy to, see the [Scaffold-ETH 2 deployment docs](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts).

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

- You can generate a PK for the deployer account with `yarn generate` or fill the `.env` file with your own PK to run the transactions.
- Check the `TARGET_CHAIN` variable in the example script to see how to deploy to the live network. (default is localhost)

### Ponder

No need to take a look here, since it's not part of the game. Just the indexer we use to keep track of all the contract events happening.
