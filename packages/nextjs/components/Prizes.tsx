import Image from "next/image";
import trophy1 from "~~/public/trophy-1.svg";
import trophy2 from "~~/public/trophy-2.svg";
import trophy3 from "~~/public/trophy-3.svg";

export function Prizes() {
  return (
    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <div className="relative flex flex-col justify-between rounded-md bg-base-300 p-8 ring-2 ring-gray-600 lg:z-10 lg:rounded-b-none lg:order-2 xl:p-10">
        <div>
          <Image src={trophy1} alt="1st Place Trophy" className="w-52 h-52 mx-auto mb-6 lg:mb-10" />
          <p className="absolute top-0 right-4 rounded-full bg-yellow-200/10 px-2.5 py-1 text-xs/5 font-semibold text-yellow-300">
            Winner!
          </p>
          <div className="flex items-center justify-between gap-x-4">
            <h3 className="text-yellow-300 text-xl/8 lg:text-3xl/8 font-dotGothic tracking-wide">1st Place</h3>
          </div>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-semibold tracking-tight text-yellow-300">$1,000 USD</span>
          </p>
          <p className="mt-5 text-yellow-300">
            Winners also get a fully functional Ethereum hardware node and BuidlGuidl swag.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-md lg:rounded-r-none lg:mt-8 lg:order-1 bg-base-300 p-8 ring-2 ring-gray-600 xl:p-10">
        <div>
          <Image src={trophy2} alt="2nd Place Trophy" className="w-40 h-40 mx-auto mb-6 lg:mb-14" />
          <div className="flex items-center justify-between gap-x-4">
            <h3 className="text-slate-200 text-xl/8 lg:text-3xl/8 font-dotGothic tracking-wide">2nd Place</h3>
          </div>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-semibold tracking-tight text-slate-200">$500 USD</span>
          </p>
          <p className="mt-5 text-slate-200">
            Winners also get a USB drive with a &quot;Ethereum node starter kit&quot; and BuidlGuidl swag.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-md lg:rounded-l-none lg:mt-8 lg:order-3 bg-base-300 p-8 ring-2 ring-gray-600 xl:p-10">
        <div>
          <Image src={trophy3} alt="3rd Place Trophy" className="w-40 h-40 mx-auto mb-6 lg:mb-14" />
          <div className="flex items-center justify-between gap-x-4">
            <h3 className="text-amber-500 text-xl/8 lg:text-3xl/8 font-dotGothic tracking-wide">3rd Place</h3>
          </div>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-semibold tracking-tight text-amber-500">$250 USD</span>
          </p>
          <p className="mt-5 text-amber-500">
            Winners also get a USB drive with a &quot;Ethereum node starter kit&quot; and BuidlGuidl swag.
          </p>
        </div>
      </div>
    </div>
  );
}
