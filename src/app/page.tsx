"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FileUploader from "./components/FileUploader";
import FileTypeTabs from "./components/file-type-tabs";
import Dropdown from "./components/dropdown";
import QualitySlider from "./components/QualitySlider";
import ProgressBar from "./components/ProgressBar";
import { fileSizeToHumanReadable } from "./lib/utils";
import {
  requestImageCompression,
  requestVideoCompression,
} from "./lib/compression";
import { Compare } from "./components/ui/compare";
import { ArrowLeftIcon } from "lucide-react";

export type ImageCompressionSettings = {
  format: 'jpeg' | 'png' | 'webp' | 'avif';
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
};

export type VideoCompressionSettings = {
  videoBitrate: string; // e.g., '1000k'
  audioBitrate: string; // e.g., '128k'
  maxWidth?: number;
  maxHeight?: number;
};

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
    setError(null);
    setProgress(0);
  }, []);

  const resetToNewFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
    setDownloading(false);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setCompressedBlob(null);
  }, [originalUrl, compressedUrl]);

  const handleModeChange = useCallback((newMode: "image" | "video") => {
    if (newMode !== mode) {
      // Reset state when switching between image and video
      setSelectedFile(null);
      setError(null);
      setProgress(0);
      setDownloading(false);
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setOriginalUrl(null);
      setCompressedUrl(null);
      setCompressedBlob(null);
      setMode(newMode);
    }
  }, [mode, originalUrl, compressedUrl]);

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
    <main className="flex flex-col gap-6 container my-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">
          Compression Studio
        </h1>
        <FileTypeTabs mode={mode} onChange={handleModeChange} />
      </div>

      {!selectedFile ? (
        // Initial state - show file uploader
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <FileUploader onFileSelected={onFileSelected} mode={mode} />
        </div>
      ) : (
        // File selected state - show comparison or settings
        <div className="flex flex-col gap-6">
          {/* Header with file info and reset button */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="flex items-center gap-3">
              <button
                onClick={resetToNewFile}
                className="p-2 rounded-md hover:bg-[var(--color-muted)] transition-colors duration-200"
                title="Try another file"
              >
                <ArrowLeftIcon className="w-5 h-5 text-[var(--color-muted-foreground)]" />
              </button>
              <div>
                <div className="font-medium text-[var(--color-foreground)]">
                  {selectedFile.name}
                </div>
                <div className="text-sm text-[var(--color-muted-foreground)]">
                  {fileSizeToHumanReadable(selectedFile.size)}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
          </div>

          {originalUrl && compressedUrl ? (
            // Show comparison when both files are ready
            <div className="flex flex-col gap-4">
              <div className="flex w-full justify-center">
                <div className="mx-auto w-full max-w-4xl h-[60vh]">
                  {mode === "image" ? (
                    <Compare
                      firstImage={originalUrl}
                      secondImage={compressedUrl}
                      firstImageClassName="object-cover object-center w-full h-full"
                      secondImageClassname="object-cover object-center w-full h-full"
                      className="h-full w-full rounded-lg"
                      slideMode="drag"
                      autoplay={false}
                    />
                  ) : (
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
                      className="h-full w-full rounded-lg"
                      slideMode="drag"
                      autoplay={false}
                    />
                  )}
                </div>
              </div>
              
              {compressedBlob && (
                <div className="text-center text-sm text-[var(--color-muted-foreground)]">
                  Compressed size: {fileSizeToHumanReadable(compressedBlob.size)} 
                  {selectedFile && (
                    <span className="ml-2">
                      ({Math.round((1 - compressedBlob.size / selectedFile.size) * 100)}% reduction)
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Show settings when file is selected but not compressed yet
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <h3 className="text-lg font-medium mb-4 text-[var(--color-foreground)]">
                Compression Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <QualitySlider
                    value={mode === "image" ? imageSettings.quality : 75}
                    onChange={(value) => {
                      if (mode === "image") {
                        setImageSettings(prev => ({ ...prev, quality: value }));
                      } else {
                        // Convert quality to bitrate for video
                        const videoBitrate = value <= 30 ? '800k' : value <= 70 ? '1500k' : '3000k';
                        const audioBitrate = value <= 30 ? '96k' : value <= 70 ? '128k' : '192k';
                        setVideoSettings(prev => ({ ...prev, videoBitrate, audioBitrate }));
                      }
                    }}
                    label={mode === "image" ? "Quality" : "Quality (affects bitrate)"}
                  />
                  
                  {mode === "image" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-foreground)]">
                        Format
                      </label>
                      <Dropdown
                        buttonText={imageSettings.format.toUpperCase()}
                        items={[
                          { label: 'JPEG', onClick: () => setImageSettings(prev => ({ ...prev, format: 'jpeg' })), type: 'button' },
                          { label: 'PNG', onClick: () => setImageSettings(prev => ({ ...prev, format: 'png' })), type: 'button' },
                          { label: 'WEBP', onClick: () => setImageSettings(prev => ({ ...prev, format: 'webp' })), type: 'button' },
                          { label: 'AVIF', onClick: () => setImageSettings(prev => ({ ...prev, format: 'avif' })), type: 'button' }
                        ]}
                        position="left"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-foreground)]">
                        Max Width
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1920"
                        value={mode === "image" ? imageSettings.maxWidth || '' : videoSettings.maxWidth || ''}
                        onChange={(e) => {
                          const value = e.target.value ? Number(e.target.value) : undefined;
                          if (mode === "image") {
                            setImageSettings(prev => ({ ...prev, maxWidth: value }));
                          } else {
                            setVideoSettings(prev => ({ ...prev, maxWidth: value }));
                          }
                        }}
                        className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-foreground)]">
                        Max Height
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1080"
                        value={mode === "image" ? imageSettings.maxHeight || '' : videoSettings.maxHeight || ''}
                        onChange={(e) => {
                          const value = e.target.value ? Number(e.target.value) : undefined;
                          if (mode === "image") {
                            setImageSettings(prev => ({ ...prev, maxHeight: value }));
                          } else {
                            setVideoSettings(prev => ({ ...prev, maxHeight: value }));
                          }
                        }}
                        className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
                      />
                    </div>
                  </div>
                  
                  {mode === "video" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-foreground)]">
                          Video Bitrate
                        </label>
                        <input
                          type="text"
                          placeholder="1500k"
                          value={videoSettings.videoBitrate}
                          onChange={(e) => setVideoSettings(prev => ({ ...prev, videoBitrate: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-foreground)]">
                          Audio Bitrate
                        </label>
                        <input
                          type="text"
                          placeholder="128k"
                          value={videoSettings.audioBitrate}
                          onChange={(e) => setVideoSettings(prev => ({ ...prev, audioBitrate: e.target.value }))}
                          className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPreview}
              disabled={!selectedFile || downloading}
              className="px-6 py-3 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-medium disabled:opacity-60 hover:bg-[var(--color-primary)]/90 transition-colors duration-200"
            >
              {downloading ? "Processing…" : originalUrl && compressedUrl ? "Recompress" : "Compress"}
            </button>
            
            {compressedBlob && (
              <button
                onClick={onDownload}
                disabled={downloading}
                className="px-6 py-3 rounded-md bg-[var(--color-success)] text-[var(--color-success-foreground)] font-medium disabled:opacity-60 hover:bg-[var(--color-success)]/90 transition-colors duration-200"
              >
                Download
              </button>
            )}
            
            {downloading && (
              <div className="flex-1">
                <ProgressBar value={progress} />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
