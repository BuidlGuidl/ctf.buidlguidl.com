"use client";

import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";

const thStyles = "whitespace-nowrap px-3 py-3.5";
const tdStyles = "whitespace-nowrap px-3 py-4";

type ChallengeStat = {
  challenge: number;
  count: number;
};

type UserStat = {
  challengesCount: number;
  count: number;
};

const Stats: NextPage = () => {
  const {
    isPending,
    error,
    data: stats,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069"}/stats`).then(res => res.json()),
  });

  if (isPending) {
    return (
      <div className="flex items-center flex-col flex-grow pt-20">
        <div className="loading loading-dots loading-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center flex-col flex-grow pt-20">
        <h1 className="text-3xl font-dotGothic tracking-wide md:text-4xl">Error loading stats</h1>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-white">
          <h2 className="text-center font-pressStart tracking-wide leading-relaxed md:text-2xl">Flags</h2>
          <div className="mt-10 max-w-3xl mx-auto">
            <dl className="grid grid-cols-1 gap-0.5 overflow-hidden border border-gray-800 rounded-2xl text-center sm:grid-cols-3 lg:grid-cols-3">
              <div className="flex flex-col bg-gray-950 p-8">
                <dt className="text-sm/6 font-semibold text-gray-300">Total Minted</dt>
                <dd className="order-first text-xl text-white font-pressStart leading-relaxed">
                  {stats.challenges.total}
                </dd>
              </div>
              <div className="flex flex-col bg-gray-950 p-8">
                <dt className="text-sm/6 font-semibold text-gray-300">Last Month</dt>
                <dd className="order-first text-xl text-white font-pressStart leading-relaxed">
                  {stats.challenges.lastMonth}
                </dd>
              </div>
              <div className="flex flex-col bg-gray-950 p-8">
                <dt className="text-sm/6 font-semibold text-gray-300">Avg per user</dt>
                <dd className="order-first text-xl text-white font-pressStart leading-relaxed">
                  {stats.users.total > 0 ? (stats.challenges.total / stats.users.total).toFixed(2) : 0}
                </dd>
              </div>
            </dl>
            <div className="mt-8 overflow-hidden bg-base-100 border-2 border-t-4 border-l-4 border-green-700 border-t-green-600 border-l-green-500">
              <table className="w-full divide-y divide-green-600">
                <thead className="bg-green-600/30 font-dotGothic tracking-wide text-left text-gray-50 md:text-xl">
                  <tr>
                    <th scope="col" className={thStyles}>
                      Flag
                    </th>
                    <th scope="col" className={thStyles}>
                      Total Minted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-base-100 md:text-xl">
                  {stats.challenges.stats
                    .sort((a: ChallengeStat, b: ChallengeStat) => a.challenge - b.challenge)
                    .map((stat: ChallengeStat) => (
                      <tr key={stat.challenge}>
                        <td className={tdStyles}>#{stat.challenge}</td>
                        <td className={tdStyles}>{stat.count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="mt-24 text-center font-pressStart tracking-wide leading-relaxed md:text-2xl">Users</h2>
          <div className="mt-10 max-w-3xl mx-auto">
            <dl className="grid grid-cols-1 gap-0.5 overflow-hidden border border-gray-800 rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-2">
              <div className="flex flex-col bg-gray-950 p-8">
                <dt className="text-sm/6 font-semibold text-gray-300">Total Users</dt>
                <dd className="order-first text-xl text-white font-pressStart leading-relaxed">{stats.users.total}</dd>
              </div>
              <div className="flex flex-col bg-gray-950 p-8">
                <dt className="text-sm/6 font-semibold text-gray-300">Last Month</dt>
                <dd className="order-first text-xl text-white font-pressStart leading-relaxed">
                  {stats.users.lastMonth}
                </dd>
              </div>
            </dl>
            <div className="mt-8 overflow-hidden bg-base-100 border-2 border-t-4 border-l-4 border-green-700 border-t-green-600 border-l-green-500">
              <table className="w-full divide-y divide-green-600">
                <thead className="bg-green-600/30 font-dotGothic tracking-wide text-left text-gray-50 md:text-xl">
                  <tr>
                    <th scope="col" className={thStyles}>
                      Flags captured
                    </th>
                    <th scope="col" className={thStyles}>
                      Users
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-base-100 md:text-xl">
                  {stats.users.stats
                    .sort((a: UserStat, b: UserStat) => a.challengesCount - b.challengesCount)
                    .map((stat: UserStat) => (
                      <tr key={stat.challengesCount}>
                        <td className={tdStyles}>{stat.challengesCount}</td>
                        <td className={tdStyles}>{stat.count}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
