"use client";

import { useCallback, useMemo, useState } from "react";
import FileUploader from "./components/FileUploader";
import CompressionSettings, { ImageCompressionSettings, VideoCompressionSettings } from "./components/CompressionSettings";
import ProgressBar from "./components/ProgressBar";
import { fileSizeToHumanReadable } from "./lib/utils";
import { requestImageCompression, requestVideoCompression } from "./lib/compression";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"image" | "video">("image");
  const [imageSettings, setImageSettings] = useState<ImageCompressionSettings>({ format: "jpeg", quality: 80 });
  const [videoSettings, setVideoSettings] = useState<VideoCompressionSettings>({ videoBitrate: "1000k", audioBitrate: "128k" });
  const [progress, setProgress] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);

  const fileInfo = useMemo(() => {
    if (!selectedFile) return null;
    return `${selectedFile.name} (${fileSizeToHumanReadable(selectedFile.size)})`;
  }, [selectedFile]);

  const onFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const onCompress = useCallback(async () => {
    if (!selectedFile) return;
    setProgress(0);
    setDownloading(true);
    try {
      if (mode === "image") {
        const blob = await requestImageCompression({
          file: selectedFile,
          format: imageSettings.format,
          quality: imageSettings.quality,
          maxWidth: imageSettings.maxWidth,
          maxHeight: imageSettings.maxHeight,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const outExt = imageSettings.format === "jpeg" ? "jpg" : imageSettings.format;
        a.download = `compressed-${selectedFile.name.replace(/\.[^.]+$/, '')}.${outExt}`;
        a.click();
        URL.revokeObjectURL(url);
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
              if (contentLength > 0) setProgress((received / contentLength) * 100);
            }
          }
          const combined = new Blob(chunks.map((c) => new Uint8Array(c)), { type: "video/mp4" });
          const blob = combined;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `compressed-${selectedFile.name.replace(/\.[^.]+$/, '')}.mp4`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `compressed-${selectedFile.name.replace(/\.[^.]+$/, '')}.mp4`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } finally {
      setDownloading(false);
      setProgress(100);
    }
  }, [selectedFile, mode, imageSettings, videoSettings]);

  return (
    <main className="max-w-4xl mx-auto my-10 px-4 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Compression Studio</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm text-[var(--color-foreground)] gap-2">
          <input type="radio" name="mode" checked={mode === 'image'} onChange={() => setMode('image')} /> Image
        </label>
        <label className="text-sm text-[var(--color-foreground)] gap-2">
          <input type="radio" name="mode" checked={mode === 'video'} onChange={() => setMode('video')} /> Video
        </label>
      </div>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 flex flex-col gap-3">
        <FileUploader onFileSelected={onFileSelected} />
        {fileInfo && <div className="text-sm text-[var(--color-muted-foreground)]">Selected: {fileInfo}</div>}
      </div>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <CompressionSettings type={mode} onChange={(s) => {
          if (mode === 'image') setImageSettings(s as ImageCompressionSettings);
          else setVideoSettings(s as VideoCompressionSettings);
        }} />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onCompress}
          disabled={!selectedFile || downloading}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] disabled:opacity-60"
        >
          {downloading ? 'Processing…' : 'Compress & Download'}
        </button>
        {downloading && <div className="flex-1"><ProgressBar value={progress} /></div>}
      </div>
    </main>
  );
}
