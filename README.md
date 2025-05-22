![BuidlGuidl CTF](https://raw.githubusercontent.com/buidlguidl/ctf.buidlguidl.com/refs/heads/main/packages/nextjs/public/readme-image.jpg)

**Welcome to the BuidlGuidl CTF**

⚡️ Live at https://ctf.buidlguidl.com

If you have your own stack already, go straight to the CTF site and start playing.

We have created this stack, which contains all the tools you need to play the CTF.

Once you have solved a challenge locally, you can deploy your solution to Optimism, and then interact with the live contracts from the frontend by [switching the network to Optimism.](#nextjs) If you are using a script, make sure you are pointing it to the Optimism RPC.

> Live challenges addresses and ABIs are already stored in your `externalContracts.ts` file.

Keep reading to learn how to set everything up.

## Setting up the environment

### Requirements

You'll need to have the following tools installed in your machine:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Foundryup](https://book.getfoundry.sh/getting-started/installation) (if foundry is selected)

> **Note for Windows users**. Foundryup is not currently supported by Powershell or Cmd, and has issues with Git Bash. You will need to use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) as your terminal.

### Setting up your local testing environment

First, install the Scaffold-ETH 2 CTF extension with create-eth:

```bash
npx create-eth@latest -e buidlguidl/ctf.buidlguidl.com:extension
```

This will create a new folder with all the tools you need to play the CTF locally. Afterward, you’ll be able to deploy the solutions to Optimism and capture the flags in the [live game](https://ctf.buidlguidl.com).

Go into the folder and run the following commands in separate terminals:

1. Run a local blockchain:

```
yarn chain
```

2. Deploy the challenges contracts locally:

  <details>
  <summary>
    hardhat
  </summary>

```
yarn deploy
```

  </details>

  <details>
  <summary>
    foundry
  </summary>

```
yarn deploy --file DeployChallenges.s.sol
```

  </details>

> Note: This command will update the `deployedContracts.ts` file (in the `scripts` and `nextjs` packages), which contains the deployed contracts addresses and ABIs.

3. Start the frontend (NextJS app):

```
yarn start
```

Now your app on `http://localhost:3000` is running entirely locally. You can break things without any consequences :)

## Repo structure / Key files

This is a [yarn](https://yarnpkg.com/features/workspaces) monorepo with different packages:

```
ctf/
└── packages/
    ├── {solidity-framework}/
    ├── nextjs/
    └── scripts/
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

This is the frontend to track your local progress in the CTF game and the UI to interact with the deployed contracts. Main pages:

- _"Homepage"_ shows your progress, with the flags you have minted and the pending flags.
- _"Debug Contracts"_ lists all the deployed contracts and allows you to interact with them.

Key folders and files:

- `app/`: Contains the Next.js pages and components (uses [app router](https://nextjs.org/docs/app)).
- `contracts/`: Contains deployed contracts ABIs and addresses.
- `package.json`: Dependencies and scripts for the Next.js app.
- `scaffold.config.ts`: Configuration file (you can switch between local and Optimism networks by changing `targetNetwork`). For extra info check our [docs](https://docs.scaffoldeth.io/deploying/deploy-nextjs-app#scaffold-app-configuration).

### scripts

Contains scripts to interact with the deployed contracts. This package comes pre-installed with [viem](https://viem.sh/)
which helps you interface with the Blockchain using Typescript scripts.

#### Key files and directories:

- `src/`: Contains the script files.
  - `example.ts`: A basic example script demonstrating how to interact with contracts.
- `contracts/`: Contains deployed contracts ABIs and addresses. (generated by `yarn deploy`)

To run the script in the local chain (test account PK with loaded funds): 

```shell
cd packages/scripts
yarn tsx src/example.ts
```

To run the script with your own PK (generated via `yarn generate` or `yarn account:import`):

```shell
cd packages/scripts
yarn tsx-with-pk src/example.ts
```

- Check the `TARGET_CHAIN` variable in the example script to see how to deploy to the live network. (default is localhost)
