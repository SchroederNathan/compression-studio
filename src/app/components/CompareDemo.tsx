"use client";

import React from "react";
import { Compare } from "@/app/components/ui/compare";

type ImageDemoProps = {
  firstImage: string;
  secondImage: string;
};

export function CompareImageDemo({ firstImage, secondImage }: ImageDemoProps) {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center px-1 [perspective:800px] [transform-style:preserve-3d] md:px-8">
      <div

        className="mx-auto h-1/2 w-full max-w-4xl rounded-3xl border border-neutral-200 bg-neutral-100 p-1 md:h-3/4 md:p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <Compare
          firstImage={firstImage}
          secondImage={secondImage}
          firstImageClassName="object-cover object-center w-full h-full"
          secondImageClassname="object-cover object-center w-full h-full"
          className="h-full w-full rounded-[22px] md:rounded-lg"
          slideMode="drag"
          autoplay={false}
        />
      </div>
    </div>
  );
}

type VideoDemoProps = {
  firstVideo: string;
  secondVideo: string;
};

export function CompareVideoDemo({ firstVideo, secondVideo }: VideoDemoProps) {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center px-1 [perspective:800px] [transform-style:preserve-3d] md:px-8">
      <div

        className="mx-auto h-1/2 w-full max-w-4xl rounded-3xl border border-neutral-200 bg-neutral-100 p-1 md:h-3/4 md:p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <Compare
          firstNode={
            <video
              src={firstVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          }
          secondNode={
            <video
              src={secondVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          }
          firstImageClassName="object-cover object-center w-full h-full"
          secondImageClassname="object-cover object-center w-full h-full"
          className="h-full w-full rounded-[22px] md:rounded-lg"
          slideMode="drag"
          autoplay={false}
        />
      </div>
    </div>
  );
}


