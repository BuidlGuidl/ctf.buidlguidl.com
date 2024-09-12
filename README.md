# 🚩 BuidlGuidl CTF - Devcon SEA 2024

Welcome to the BuidlGuidl CTF - Devcon SEA 2024!

This is build with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2), and it contains everything you need to play the CTF (More about this in Repo structure / Key files)

If you want to play with your own stack, you can also go directly to the challenges in 'packages/nextjs/data/challenges'.

## Local set up

If you want to set up the local environment, follow the steps below:

### Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone the repository and install dependencies:

```
git clone https://github.com/buidlguidl/ctf-devcon.git
cd ctf-devcon
yarn install
```

2. Run a local network:

```
yarn chain
```

3. Deploy the contracts:

```
yarn deploy
```

4. Start Ponder:

```
yarn ponder:dev
```

5. Start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`.

### Repo structure / Key files

- Monorepo
- packages: hardhat / foundry / scripts / nextjs
- scaffold.config.ts: .....
- externalContracts.ts: .....
- ....

### Scripts

You can use `packages/scripts` directory to interact with challenges contract. This package comes pre-installed with [viem](https://viem.sh/) which helps you inteface with blockchain using typescirpt scripts. Checkout `packages/scripts/src/example.ts` for an basic example.

To run scripts first cd into `packages/scripts`:

```shell
cd packages/scripts
```

Then run:

```shell
yarn tsx <path-to-script>
```

eg: `yarn tsx src/example.ts`

> TIP: Whenever you run `yarn deploy` it will `packages/scripts/contracts/deployedContracts.ts` file which contains the deployed contract addresses and abi.
