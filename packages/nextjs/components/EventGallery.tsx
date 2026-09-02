"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import event1 from "~~/public/gallery/event-1.jpg";
import event2 from "~~/public/gallery/event-2.jpg";
import event3 from "~~/public/gallery/event-3.jpg";
import event4 from "~~/public/gallery/event-4.jpg";
import event5 from "~~/public/gallery/event-5.jpg";

const photos = [
  { src: event1, alt: "Players working on the CTF challenges at Devcon SEA 2024" },
  { src: event2, alt: "The CTF room with the live leaderboard on the screen" },
  { src: event3, alt: "Live leaderboard and game countdown on the main screen" },
  { src: event4, alt: "The winning team on stage in front of the leaderboard" },
  { src: event5, alt: "The BuidlGuidl team after the CTF game" },
];

export function EventGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const move = useCallback((step: number) => {
    setOpenIndex(current => (current === null ? null : (current + step + photos.length) % photos.length));
  }, []);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, move]);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            key={photo.src.src}
            onClick={() => setOpenIndex(index)}
            aria-label={`Open photo: ${photo.alt}`}
            className="group relative aspect-square overflow-hidden rounded-md ring-2 ring-gray-600 transition hover:ring-primary"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              placeholder="blur"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Event photo gallery"
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button onClick={close} aria-label="Close gallery" className="absolute right-4 top-4 p-2 text-primary">
            <XMarkIcon className="h-8 w-8" />
          </button>

          <button
            onClick={event => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 p-2 text-primary sm:left-6"
          >
            <ChevronLeftIcon className="h-10 w-10" />
          </button>

          <div className="relative h-[85vh] w-[90vw]" onClick={event => event.stopPropagation()}>
            <Image
              src={photos[openIndex].src}
              alt={photos[openIndex].alt}
              fill
              sizes="90vw"
              priority
              className="object-contain"
            />
          </div>

          <button
            onClick={event => {
              event.stopPropagation();
              move(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 p-2 text-primary sm:right-6"
          >
            <ChevronRightIcon className="h-10 w-10" />
          </button>

          <p className="absolute bottom-6 font-dotGothic tracking-wide text-primary">
            {openIndex + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
