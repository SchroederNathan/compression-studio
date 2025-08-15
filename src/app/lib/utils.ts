import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function fileSizeToHumanReadable(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2)} ${units[i]}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
