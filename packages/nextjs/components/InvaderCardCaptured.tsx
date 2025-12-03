import Image from "next/image";
import Link from "next/link";
import { CheckIcon } from "./CheckIcon";
import { FlagIcon } from "./FlagIcon";
import clsx from "clsx";
import { getFormattedDateTime } from "~~/utils/date";
import { getFlagColor } from "~~/utils/flagColor";
import { CHALLENGE_NAMES, getSlugBySeason } from "~~/utils/getChallenges";

export function InvaderCardCaptured({
  challengeId,
  season,
  timestamp,
}: {
  challengeId: number;
  season: number;
  timestamp?: number;
}) {
  const timeCaptured = timestamp ? getFormattedDateTime(new Date(timestamp * 1000)) : "";

  return (
    <div className="tooltip" data-tip={`Captured: ${timeCaptured}`}>
      <div
        className="relative flex items-center justify-center border border-slate-400 bg-gray-950 rounded-md aspect-square overflow-hidden"
        style={{
          boxShadow: "0 0 30px rgba(245, 158, 11, 0.25)",
        }}
      >
        <Link href={`/${getSlugBySeason(season)}/challenges/${challengeId}`}>
          <div className="mx-auto relative w-10 text-center">
            <Image
              width={96}
              height={96}
              className="mx-auto w-10 h-10 md:w-12 md:h-12"
              src={`/season-${season}/invader-${challengeId}.svg`}
              alt={`Invader Season ${season} - Challenge ${challengeId}`}
            />
            <div className="absolute top-0 -right-7">
              <div className="relative rotate-12">
                <FlagIcon className={clsx("w-8 h-8", getFlagColor(challengeId))} />
                <span className="absolute top-[5px] left-[6px] m-0 p-0 leading-none text-xs text-white font-semibold [text-shadow:_1px_1px_1px_rgb(0_0_0_/_40%)]">
                  {challengeId}
                </span>
              </div>
            </div>
          </div>
          <p className="m-0 px-2 text-sm text-white font-semibold antialiased">
            {CHALLENGE_NAMES[season]?.[challengeId.toString()] ?? `Challenge ${challengeId}`}
          </p>
        </Link>
        <CheckIcon className="absolute top-2 left-3 w-6 h-6 text-primary" />
      </div>
    </div>
  );
}
