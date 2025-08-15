'use client';

import { useState } from 'react';

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

type Props = {
  type: 'image' | 'video';
  onChange: (settings: ImageCompressionSettings | VideoCompressionSettings) => void;
};

export default function CompressionSettings({ type, onChange }: Props) {
  const [image, setImage] = useState<ImageCompressionSettings>({ format: 'jpeg', quality: 80 });
  const [video, setVideo] = useState<VideoCompressionSettings>({ videoBitrate: '1000k', audioBitrate: '128k' });

  return (
    <div className="flex gap-3 flex-wrap">
      {type === 'image' ? (
        <>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Format</span>
            <select
              className="px-2 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              value={image.format}
              onChange={(e) => {
                const next = { ...image, format: e.target.value as ImageCompressionSettings['format'] };
                setImage(next);
                onChange(next);
              }}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="avif">AVIF</option>
            </select>
          </label>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Quality</span>
            <input
              className="px-2 py-1 w-24 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="number"
              min={1}
              max={100}
              value={image.quality}
              onChange={(e) => {
                const next = { ...image, quality: Number(e.target.value) };
                setImage(next);
                onChange(next);
              }}
            />
          </label>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Max width</span>
            <input
              className="px-2 py-1 w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="number"
              placeholder="e.g. 1920"
              value={image.maxWidth ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                const next = { ...image, maxWidth: v };
                setImage(next);
                onChange(next);
              }}
            />
          </label>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Max height</span>
            <input
              className="px-2 py-1 w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="number"
              placeholder="e.g. 1080"
              value={image.maxHeight ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                const next = { ...image, maxHeight: v };
                setImage(next);
                onChange(next);
              }}
            />
          </label>
        </>
      ) : (
        <>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Video bitrate</span>
            <input
              className="px-2 py-1 w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="text"
              placeholder="1000k"
              value={video.videoBitrate}
              onChange={(e) => {
                const next = { ...video, videoBitrate: e.target.value };
                setVideo(next);
                onChange(next);
              }}
            />
          </label>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Audio bitrate</span>
            <input
              className="px-2 py-1 w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="text"
              placeholder="128k"
              value={video.audioBitrate}
              onChange={(e) => {
                const next = { ...video, audioBitrate: e.target.value };
                setVideo(next);
                onChange(next);
              }}
            />
          </label>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Max width</span>
            <input
              className="px-2 py-1 w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="number"
              placeholder="e.g. 1920"
              value={video.maxWidth ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                const next = { ...video, maxWidth: v };
                setVideo(next);
                onChange(next);
              }}
            />
          </label>
          <label className="gap-2 text-sm text-[var(--color-foreground)]">
            <span>Max height</span>
            <input
              className="px-2 py-1 w-32 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
              type="number"
              placeholder="e.g. 1080"
              value={video.maxHeight ?? ''}
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                const next = { ...video, maxHeight: v };
                setVideo(next);
                onChange(next);
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}


