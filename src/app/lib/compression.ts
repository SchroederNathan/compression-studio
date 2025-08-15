export type CompressImageForm = {
  file: File;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export async function requestImageCompression(payload: CompressImageForm): Promise<Blob> {
  const form = new FormData();
  form.append('file', payload.file);
  if (payload.format) form.append('format', String(payload.format));
  if (payload.quality != null) form.append('quality', String(payload.quality));
  if (payload.maxWidth != null) form.append('maxWidth', String(payload.maxWidth));
  if (payload.maxHeight != null) form.append('maxHeight', String(payload.maxHeight));

  const res = await fetch('/api/compress-image', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Image compression failed');
  return await res.blob();
}

export type CompressVideoForm = {
  file: File;
  videoBitrate?: string; // e.g. '1000k'
  audioBitrate?: string; // e.g. '128k'
  maxWidth?: number;
  maxHeight?: number;
};

export async function requestVideoCompression(payload: CompressVideoForm): Promise<Response> {
  const form = new FormData();
  form.append('file', payload.file);
  if (payload.videoBitrate) form.append('videoBitrate', payload.videoBitrate);
  if (payload.audioBitrate) form.append('audioBitrate', payload.audioBitrate);
  if (payload.maxWidth != null) form.append('maxWidth', String(payload.maxWidth));
  if (payload.maxHeight != null) form.append('maxHeight', String(payload.maxHeight));

  const res = await fetch('/api/compress-video', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Video compression failed');
  return res;
}


