# 🚩 BuidlGuidl CTF - Devcon SEA 2024

Welcome to the BuidlGuidl CTF - Devcon SEA 2024!

This repository was built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and it contains 2 things:

- The website with the challenges, which is live at https://ctf-devcon.buidlguidl.com/
- All the tools that you need to play (& win!) the CTF.

If you want to play with your own stack, you can skip this and directly go to https://ctf-devcon.buidlguidl.com/ and start hacking.

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

This is a monorepo with different packages:

### hardhat / foundry

TODO

### nextjs

This is the frontend of the game

### scripts

You can use `packages/scripts` directory to interact with challenges contracts. This package comes pre-installed with [viem](https://viem.sh/) which helps you interface with the Blockchain using typescript scripts. Checkout `packages/scripts/src/example.ts` for a basic example.

To run scripts first cd into `packages/scripts`:

```shell
cd packages/scripts
```

Then run:

```shell
yarn tsx <path-to-script>
```

eg: `yarn tsx src/example.ts`

### ponder

No need to take a look here, since it's not part of the game. Just the indexer we use to keep track of all the contract events happening
