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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imageLevel, setImageLevel] = useState<'low' | 'medium' | 'high' | 'custom'>('medium');
  const [videoLevel, setVideoLevel] = useState<'low' | 'medium' | 'high' | 'custom'>('medium');

  function applyImageLevel(level: 'low' | 'medium' | 'high') {
    const quality = level === 'low' ? 50 : level === 'medium' ? 75 : 90;
    const next = { ...image, quality };
    setImage(next);
    onChange(next);
  }

  function applyVideoLevel(level: 'low' | 'medium' | 'high') {
    const videoBitrate = level === 'low' ? '800k' : level === 'medium' ? '1500k' : '3000k';
    const audioBitrate = level === 'low' ? '96k' : level === 'medium' ? '128k' : '192k';
    const next = { ...video, videoBitrate, audioBitrate };
    setVideo(next);
    onChange(next);
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {type === 'image' ? (
        <label className="gap-2 text-sm text-[var(--color-foreground)]">
          <span>Quality</span>
          <select
            className="px-2 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
            value={imageLevel}
            onChange={(e) => {
              const level = e.target.value as typeof imageLevel;
              setImageLevel(level);
              if (level !== 'custom') applyImageLevel(level);
            }}
          >
            <option value="low">Low (smaller file)</option>
            <option value="medium">Medium</option>
            <option value="high">High (better quality)</option>
            <option value="custom">Custom</option>
          </select>
        </label>
      ) : (
        <label className="gap-2 text-sm text-[var(--color-foreground)]">
          <span>Quality</span>
          <select
            className="px-2 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)]"
            value={videoLevel}
            onChange={(e) => {
              const level = e.target.value as typeof videoLevel;
              setVideoLevel(level);
              if (level !== 'custom') applyVideoLevel(level);
            }}
          >
            <option value="low">Low (smaller file)</option>
            <option value="medium">Medium</option>
            <option value="high">High (better quality)</option>
            <option value="custom">Custom</option>
          </select>
        </label>
      )}

      <button
        type="button"
        className="px-2 py-1 text-xs rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
        onClick={() => setShowAdvanced((v) => !v)}
      >
        {showAdvanced ? 'Hide advanced' : 'Show advanced'}
      </button>

      {type === 'image' ? (
        <>
          {showAdvanced && (
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
                    setImageLevel('custom');
                  }}
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WEBP</option>
                  <option value="avif">AVIF</option>
                </select>
              </label>
              <label className="gap-2 text-sm text-[var(--color-foreground)]">
                <span>Quality (1-100)</span>
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
                    setImageLevel('custom');
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
                    setImageLevel('custom');
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
                    setImageLevel('custom');
                  }}
                />
              </label>
            </>
          )}
        </>
      ) : (
        <>
          {showAdvanced && (
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
                    setVideoLevel('custom');
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
                    setVideoLevel('custom');
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
                    setVideoLevel('custom');
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
                    setVideoLevel('custom');
                  }}
                />
              </label>
            </>
          )}
        </>
      )}
    </div>
  );
}


