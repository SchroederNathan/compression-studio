'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { FilePlay, Image as ImageIcon } from 'lucide-react';

type Props = {
  onFileSelected?: (file: File) => void;
  mode?: 'image' | 'video';
};

export default function FileUploader({ onFileSelected, mode = 'image' }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = useCallback((file?: File | null) => {
    if (!file) return;
    setFileName(file.name);
    onFileSelected?.(file);
  }, [onFileSelected]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleSelect(file);
  }, [handleSelect]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleSelect(file);
  }, [handleSelect]);

  return (
    <div className="flex w-full">
      <label
        htmlFor={inputId}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={
          `group relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed p-10 text-center cursor-pointer focus:outline-2 focus:outline-offset-2 ` +
          `transition-colors ` +
          `${dragActive ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'} ` +
          `bg-[var(--color-card)] hover:border-[var(--color-foreground)]/40 focus:outline-[var(--color-primary)]`
        }
      >
        <div className="relative mx-auto h-16 w-16">
          {/* side accent squares */}
          <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border-3 border-muted-foreground -rotate-6 z-0 transition-transform duration-200 ease-out group-hover:-translate-x-1 group-hover:-rotate-14 group-hover:border-foreground" />
          <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border-3 border-muted-foreground rotate-6 z-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:rotate-14 group-hover:border-foreground" />
          {/* main icon */}
          <div className="relative z-10 flex items-center justify-center h-16 w-16 text-muted-foreground transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:text-foreground">
            {mode === 'image' ? (
              <ImageIcon className="h-16 w-16 fill-[var(--color-card)]" strokeWidth={1.5} />
            ) : (
              <FilePlay className="h-16 w-16 fill-[var(--color-card)]" strokeWidth={1.5} />
            )}
          </div>
        </div>
        <span className="mt-4 block text-sm font-medium text-[var(--color-foreground)]">
          {fileName ? fileName : 'Drop a file here or click to select'}
        </span>
        <span className="mt-1 block text-xs text-[var(--color-muted-foreground)]">{mode === 'image' ? 'Images supported' : 'Videos supported'}</span>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          onChange={onChange}
          className="hidden"
          accept={mode === 'image' ? 'image/*' : 'video/*'}
        />
      </label>
    </div>
  );
}


