import { NextRequest, NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { mkdirSync, writeFileSync, readFileSync, statSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

export const runtime = 'nodejs';

// Resolve ffmpeg/ffprobe paths robustly to avoid ENOENT in dev/runtime
const ffmpegCandidates = [
  process.env.FFMPEG_PATH,
  (ffmpegStatic as unknown as string),
  '/opt/homebrew/bin/ffmpeg', // macOS (arm64)
  '/usr/local/bin/ffmpeg',
  '/usr/bin/ffmpeg',
].filter(Boolean) as string[];

for (const candidate of ffmpegCandidates) {
  try {
    if (existsSync(candidate)) {
      ffmpeg.setFfmpegPath(candidate);
      break;
    }
  } catch {}
}

const ffprobeCandidates = [
  process.env.FFPROBE_PATH,
  (ffprobeStatic as unknown as { path?: string })?.path,
  '/opt/homebrew/bin/ffprobe',
  '/usr/local/bin/ffprobe',
  '/usr/bin/ffprobe',
].filter(Boolean) as string[];

for (const candidate of ffprobeCandidates) {
  try {
    if (existsSync(candidate)) {
      ffmpeg.setFfprobePath(candidate);
      break;
    }
  } catch {}
}

const TEMP_DIR = join(process.cwd(), 'temp');

export async function POST(request: NextRequest) {
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }

  const inputPath = join(TEMP_DIR, `input-${randomUUID()}.mp4`);
  const outputPath = join(TEMP_DIR, `output-${randomUUID()}.mp4`);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const targetBitrate = String(formData.get('videoBitrate') || '1000k');
    const targetAudioBitrate = String(formData.get('audioBitrate') || '128k');
    const targetWidth = Number(formData.get('maxWidth'));
    const targetHeight = Number(formData.get('maxHeight'));

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    writeFileSync(inputPath, buffer);

    let lastStderr = '';
    const isDarwin = process.platform === 'darwin';
    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .videoCodec(isDarwin ? 'h264_videotoolbox' : 'libx264')
        .videoBitrate(targetBitrate)
        .format('mp4')
        .outputOptions('-movflags', 'faststart')
        .outputOptions('-pix_fmt', 'yuv420p');

      if (Number.isFinite(targetWidth) || Number.isFinite(targetHeight)) {
        const size = `${Number.isFinite(targetWidth) ? targetWidth : '?'}x${Number.isFinite(targetHeight) ? targetHeight : '?'}`;
        command = command.size(size);
      }

      command
        .on('stderr', (line: string) => { lastStderr = line; })
        .on('end', () => resolve())
        .on('error', (err: unknown) => reject(err instanceof Error ? new Error(`${err.message}${lastStderr ? `\n${lastStderr}` : ''}`) : err))
        .save(outputPath);
    });

    const buf = readFileSync(outputPath);
    const stats = statSync(outputPath);
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="compressed-${file.name.replace(/\.[^.]+$/, '')}.mp4"`,
        'Content-Length': String(stats.size)
      }
    });
  } catch (error) {
    const message = (error instanceof Error && error.message) ? error.message : 'Video compression failed';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    try { unlinkSync(inputPath); } catch {}
    try { unlinkSync(outputPath); } catch {}
  }
}


