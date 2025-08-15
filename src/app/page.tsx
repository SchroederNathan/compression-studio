"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FileUploader from "./components/FileUploader";
import CompressionSettings, {
  ImageCompressionSettings,
  VideoCompressionSettings,
} from "./components/CompressionSettings";
import ProgressBar from "./components/ProgressBar";
import { fileSizeToHumanReadable } from "./lib/utils";
import {
  requestImageCompression,
  requestVideoCompression,
} from "./lib/compression";
import { Compare } from "./components/ui/compare";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"image" | "video">("image");
  const [imageSettings, setImageSettings] = useState<ImageCompressionSettings>({
    format: "jpeg",
    quality: 80,
  });
  const [videoSettings, setVideoSettings] = useState<VideoCompressionSettings>({
    videoBitrate: "1000k",
    audioBitrate: "128k",
  });
  const [progress, setProgress] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setOriginalUrl(null);
      setCompressedUrl(null);
      setCompressedBlob(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setCompressedUrl(null);
    setCompressedBlob(null);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const fileInfo = useMemo(() => {
    if (!selectedFile) return null;
    return `${selectedFile.name} (${fileSizeToHumanReadable(
      selectedFile.size
    )})`;
  }, [selectedFile]);

  const onFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const onPreview = useCallback(async () => {
    if (!selectedFile) return;
    setProgress(0);
    setDownloading(true);
    setError(null);
    try {
      if (mode === "image") {
        const blob = await requestImageCompression({
          file: selectedFile,
          format: imageSettings.format,
          quality: imageSettings.quality,
          maxWidth: imageSettings.maxWidth,
          maxHeight: imageSettings.maxHeight,
        });
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        const url = URL.createObjectURL(blob);
        setCompressedBlob(blob);
        setCompressedUrl(url);
      } else {
        const res = await requestVideoCompression({
          file: selectedFile,
          videoBitrate: videoSettings.videoBitrate,
          audioBitrate: videoSettings.audioBitrate,
          maxWidth: videoSettings.maxWidth,
          maxHeight: videoSettings.maxHeight,
        });

        // Stream download with progress (best-effort; fetch does not expose progress directly)
        const reader = (res.body as ReadableStream)?.getReader();
        if (reader) {
          const contentLength = Number(res.headers.get("Content-Length") || 0);
          const chunks: Uint8Array[] = [];
          let received = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              received += value.length;
              if (contentLength > 0)
                setProgress((received / contentLength) * 100);
            }
          }
          const blob = new Blob(
            chunks.map((c) => new Uint8Array(c)),
            { type: "video/mp4" }
          );
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          const url = URL.createObjectURL(blob);
          setCompressedBlob(blob);
          setCompressedUrl(url);
        } else {
          const blob = await res.blob();
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          const url = URL.createObjectURL(blob);
          setCompressedBlob(blob);
          setCompressedUrl(url);
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Compression failed";
      setError(message);
    } finally {
      setDownloading(false);
      setProgress(100);
    }
  }, [selectedFile, mode, imageSettings, videoSettings, compressedUrl]);

  const onDownload = useCallback(() => {
    if (!compressedBlob || !selectedFile) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    if (mode === "image") {
      const outExt =
        imageSettings.format === "jpeg" ? "jpg" : imageSettings.format;
      a.download = `compressed-${selectedFile.name.replace(
        /\.[^.]+$/,
        ""
      )}.${outExt}`;
    } else {
      a.download = `compressed-${selectedFile.name.replace(
        /\.[^.]+$/,
        ""
      )}.mp4`;
    }
    a.click();
    URL.revokeObjectURL(url);
  }, [compressedBlob, selectedFile, mode, imageSettings]);

  return (
    <main className="max-w-4xl mx-auto my-10 px-4 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">
        Compression Studio
      </h1>
      <div className="flex items-center gap-3">
        <label className="text-sm text-[var(--color-foreground)] gap-2">
          <input
            type="radio"
            name="mode"
            checked={mode === "image"}
            onChange={() => setMode("image")}
          />{" "}
          Image
        </label>
        <label className="text-sm text-[var(--color-foreground)] gap-2">
          <input
            type="radio"
            name="mode"
            checked={mode === "video"}
            onChange={() => setMode("video")}
          />{" "}
          Video
        </label>
      </div>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 flex flex-col gap-3">
        <FileUploader onFileSelected={onFileSelected} />
        {fileInfo && (
          <div className="text-sm text-[var(--color-muted-foreground)]">
            Selected: {fileInfo}
          </div>
        )}
      </div>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <CompressionSettings
          type={mode}
          onChange={(s) => {
            if (mode === "image")
              setImageSettings(s as ImageCompressionSettings);
            else setVideoSettings(s as VideoCompressionSettings);
          }}
        />
      </div>
      {selectedFile && originalUrl && compressedUrl && (
        <>
          <h2 className="text-lg font-medium mb-3 text-[var(--color-foreground)]">
            Preview
          </h2>
          {mode === "image" ? (
            <div className="flex w-full justify-center">
              <div className="mx-auto w-full max-w-4xl h-[60vh]">
                <Compare
                  firstImage={originalUrl}
                  secondImage={compressedUrl}
                  firstImageClassName="object-cover object-center w-full h-full"
                  secondImageClassname="object-cover object-center w-full h-full"
                  className="h-full w-full rounded-[22px] md:rounded-lg"
                  slideMode="drag"
                  autoplay={false}
                />
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-center [perspective:800px] [transform-style:preserve-3d] ">
              <div className="mx-auto w-full max-w-4xl h-[60vh]">
                <Compare
                  firstNode={
                    <video
                      src={originalUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  }
                  secondNode={
                    <video
                      src={compressedUrl}
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
          )}
        </>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={onPreview}
          disabled={!selectedFile || downloading}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] disabled:opacity-60"
        >
          {downloading ? "Processing…" : "Start / Preview"}
        </button>
        <button
          onClick={onDownload}
          disabled={!compressedBlob || downloading}
          className="px-4 py-2 rounded-md bg-[var(--color-foreground)] text-[var(--color-background)] border border-[var(--color-border)] disabled:opacity-60"
        >
          Download
        </button>
        {downloading && (
          <div className="flex-1">
            <ProgressBar value={progress} />
          </div>
        )}
      </div>
    </main>
  );
}
