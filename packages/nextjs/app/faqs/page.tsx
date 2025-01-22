import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const faqs = [
  {
    id: 1,
    question: "What is Solidity Invaders?",
    answer:
      "Solidity Invaders is a Capture the Flag (CTF) game that teaches you how to write secure smart contracts in Solidity. The game was originally created by BuidlGuild for Devcon 7 in Bangkok, Thailand. The original website can be viewed at ",
    link: "https://ctf-devcon.buidlguidl.com",
  },
  {
    id: 2,
    question: "How should I complete the challenges?",
    answer:
      "Advanced players may use any means necessary to progress through the challenges. We recommend that beginners use this Scaffold ETH extension that contains everything you need to play the game and test your solutions locally:",
    link: "https://github.com/buidlguidl/ctf.buidlguidl.com/tree/extension",
  },
  {
    id: 3,
    question: "What are the flags?",
    answer:
      "Upon capturing a flag, you will mint a SVG NFT that represents the flag you captured. There are 12 flags in total, each corresponding to a different challenge.",
  },
  {
    id: 4,
    question: "What chain/network is this game on?",
    answer:
      "The challenges are deployed on Optimism mainnet. You will need to use real ETH on Optimism in order to complete the challenges. But you can always play locally!",
  },
  {
    id: 5,
    question: "How are points tracked?",
    answer:
      "You will also receive points for each flag you capture. Each flag must be minted to the same Ethereum address for the points to be counted properly.",
  },
  {
    id: 6,
    question: "How can I track my progress?",
    answer:
      "Check your progress by visiting `/profile/{YourRegisteredAddress}`. You may also connect your registered Ethereum address to this website and view your progress by clicking on 'My Flags'.",
  },
  {
    id: 7,
    question: "Is there a leaderboard?",
    answer:
      "There isn't a leaderboard for this version of the game. Instead, there is a Stats page which can be found at",
    link: "/stats",
  },
];

export const metadata = getMetadata({
  title: "FAQs",
  description: "Check out the FAQs for the BuidlGuidl CTF",
});

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-pressStart text-lg/8 md:text-2xl">Frequently Asked Questions</h2>
      </div>
      <div className="mt-20">
        <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
          {faqs.map(faq => (
            <div key={faq.id}>
              <dt className="text-base/7 font-bold text-white">{faq.question}</dt>
              <dd className="mt-2 text-base/7 text-gray-200">
                {faq.answer}{" "}
                {faq.link && (
                  <a className="text-primary link" href={faq.link} target="_blank">
                    {faq.link}
                  </a>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
