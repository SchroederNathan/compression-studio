'use client';

import { useCallback, useState } from 'react';

type Props = {
  onFileSelected?: (file: File) => void;
};

export default function FileUploader({ onFileSelected }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelected?.(file);
    }
  }, [onFileSelected]);

  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-border)]">
        <span className="text-sm font-medium">Select file</span>
        <input type="file" onChange={onChange} className="hidden" />
      </label>
      {fileName && <span className="text-sm text-[var(--color-foreground)]">{fileName}</span>}
    </div>
  );
}


