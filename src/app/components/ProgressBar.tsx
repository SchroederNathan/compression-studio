"use client";

type Props = {
  value: number; // 0-100
};

export default function ProgressBar({ value }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full h-3 rounded-lg bg-[var(--color-muted)]">
      <div
        className={`h-full w-[${clamped}%] rounded-lg bg-[var(--color-primary)] transition-all duration-150`}
      />
    </div>
  );
}
