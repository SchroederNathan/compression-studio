"use client";
import { EllipsisVertical } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { SparklesCore } from "./sparkles";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  firstNode?: React.ReactNode;
  secondNode?: React.ReactNode;
}
export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  firstNode,
  secondNode,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const [, setIsMouseOver] = useState(false);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to detect aspect ratio from image
  const detectImageAspectRatio = useCallback((imageSrc: string) => {
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspectRatio(ratio);
    };
    img.src = imageSrc;
  }, []);

  // Helper function to detect aspect ratio from video element
  const detectVideoAspectRatio = useCallback((videoElement: HTMLVideoElement) => {
    const handleLoadedMetadata = () => {
      if (videoElement.videoWidth && videoElement.videoHeight) {
        const ratio = videoElement.videoWidth / videoElement.videoHeight;
        setAspectRatio(ratio);
      }
    };

    if (videoElement.readyState >= 1) {
      // Metadata already loaded
      handleLoadedMetadata();
    } else {
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    }
  }, []);

  // Effect to detect aspect ratio when images change
  useEffect(() => {
    if (firstImage) {
      detectImageAspectRatio(firstImage);
    } else if (secondImage) {
      detectImageAspectRatio(secondImage);
    }
  }, [firstImage, secondImage, detectImageAspectRatio]);

  // Effect to detect aspect ratio from video nodes
  useEffect(() => {
    if (firstNode || secondNode) {
      // Look for video elements in the DOM after a short delay to ensure they're rendered
      setTimeout(() => {
        const videos = sliderRef.current?.querySelectorAll('video');
        if (videos && videos.length > 0) {
          detectVideoAspectRatio(videos[0]);
        }
      }, 100);
    }
  }, [firstNode, secondNode, detectVideoAspectRatio]);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress =
        (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16); // ~60fps
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    setIsMouseOver(true);
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    () => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging]
  );

  const handleMouseDown = useCallback(
    () => handleStart(),
    [handleStart]
  );
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const handleTouchStart = useCallback(
    () => {
      if (!autoplay) {
        handleStart();
      }
    },
    [handleStart, autoplay]
  );

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, autoplay]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("w-full overflow-hidden", aspectRatio ? "" : "h-full min-h-[200px]", className)}
      style={{
        position: "relative",
        cursor: slideMode === "drag" ? "grab" : "col-resize",
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-indigo-500 to-transparent"
          style={{
            left: `${sliderXPercent}%`,
            top: "0",
            zIndex: 40,
          }}
          transition={{ duration: 0 }}
        >
          <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent z-20 opacity-50" />
          <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100" />
          <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
            <MemoizedSparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>
          {showHandlebar && (
            <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute   flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <EllipsisVertical className="h-4 w-4 text-black" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        <AnimatePresence initial={false}>
          {(firstNode || firstImage) ? (
            <motion.div
              className={cn(
                "absolute inset-0 z-20 rounded-lg shrink-0 w-full h-full select-none overflow-hidden",
                firstImageClassName
              )}
              style={{
                clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
              }}
              transition={{ duration: 0 }}
            >
              {firstNode ? (
                <div className={cn("absolute inset-0 w-full h-full", firstImageClassName)}>
                  {firstNode}
                </div>
              ) : (
                <Image
                  alt="first image"
                  src={firstImage}
                  fill
                  className={cn(
                    "object-cover rounded-lg",
                    firstImageClassName
                  )}
                  draggable={false}
                  sizes="50vw"
                />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {(secondNode || secondImage) ? (
          <motion.div
            className={cn(
              "absolute top-0 left-0 z-[19] rounded-lg w-full h-full select-none overflow-hidden",
              secondImageClassname
            )}
            transition={{ duration: 0 }}
          >
            {secondNode ? (
              <div className={cn("absolute inset-0 w-full h-full", secondImageClassname)}>
                {secondNode}
              </div>
            ) : (
              <Image
                className={cn(
                  "object-cover rounded-lg",
                  secondImageClassname
                )}
                alt="second image"
                src={secondImage}
                fill
                draggable={false}
                sizes="50vw"
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
