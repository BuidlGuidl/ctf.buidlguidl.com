export const imports = `import { FlagTracker } from "~~/components/FlagTracker";`;

export const description = `
  <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-base-content mb-4">
              This stack contains all the tools you need to play the CTF locally, from contract debugging to scripting
              and transaction tracking.
            </p>
            <p className="text-base text-base-content">
              For detailed setup instructions and documentation, check out the{" "}
              <a
                href="https://github.com/BuidlGuidl/ctf.buidlguidl.com/tree/extension"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Readme
              </a>
            </p>
          </div>

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-base-100 p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">How to Play 🎮</h2>
              <div className="space-y-4">
                <p className="text-base">
                  1. You can use the{" "}
                  <Link href="/debug" className="link">
                    Debug Contracts
                  </Link>{" "}
                  tab to interact with the challenge contracts and the solutions you deploy
                </p>
                <p className="text-base">
                  2. Each challenge requires you to find a way to mint a flag NFT by solving smart contract puzzles
                </p>
                <p className="text-base">3. Track your progress below - there are 12 flags to capture!</p>
              </div>
            </div>
            <FlagTracker />
          </div>
`;

export const externalExtensionName = "BuidlGuidl CTF";
