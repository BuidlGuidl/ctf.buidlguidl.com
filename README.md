![BuidlGuidl CTF](./packages/nextjs/public/readme-image.jpg?raw=true&v2)

**Welcome to the BuidlGuidl CTF**

⚡️ Live at https://ctf.buidlguidl.com

> [!NOTE]
> This branch contains the code for the BuidlGuidl CTF website.
>
> If you are looking for the stack to play the CTF, please check the [extension](https://github.com/buidlGuidl/ctf.buidlguidl.com/tree/extension) branch, which includes:
>
> - A user-friendly frontend to interact with the contracts (/debug page).
> - Simplified workflow for deploying new contracts.
> - A local blockchain and a block explorer for testing.
> - Example scripts to interact with smart contracts via scripts.

---

This repository was built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2).

## Setting up the environment

### Requirements

You'll need to have the following tools installed on your machine:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Setting up your local testing environment

First, you'll need to clone this repository and install dependencies:

```
git clone https://github.com/buidlguidl/ctf.buidlguidl.com.git
cd ctf.buidlguidl.com
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

3. Start Ponder (event indexer):

```
yarn ponder:dev
```

> Note: This just runs the ponder indexer locally, which is used to keep track of all the events happening in the blockchain.

4. Start the frontend (NextJS app):

```
yarn start
```

Visit the CTF local website at: `http://localhost:3000`. Remember to switch to `hardhat` on `scaffold.config.ts`.


> [!NOTE]
> You can also test with the live data pointing to the Ponder live URL (update `NEXT_PUBLIC_PONDER_URL` env var)

## Documentation

Visit [Scaffold-ETH 2 docs](https://docs.scaffoldeth.io) to learn all the technical details and guides of Scaffold-ETH 2.

To know more about its features, check the [Scaffold-ETH 2 website](https://scaffoldeth.io).

For more information about the BuidlGuidl CTF, please visit the [BuidlGuidl CTF FAQs](https://ctf.buidlguidl.com/faqs).

## Contributing to the BuidlGuidl CTF website

We welcome contributions to the BuidlGuidl CTF website!

Please see [CONTRIBUTING.MD](https://github.com/BuidlGuidl/ctf.buidlguidl.com/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to the BuidlGuidl CTF website.
