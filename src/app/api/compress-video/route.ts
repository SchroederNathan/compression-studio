import { NextRequest, NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { mkdirSync, writeFileSync, createReadStream, statSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

export const runtime = 'nodejs';

ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string);

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

    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .videoBitrate(targetBitrate)
        .audioBitrate(targetAudioBitrate)
        .format('mp4')
        .outputOptions('-movflags', 'faststart');

      if (Number.isFinite(targetWidth) || Number.isFinite(targetHeight)) {
        const size = `${Number.isFinite(targetWidth) ? targetWidth : '?'}x${Number.isFinite(targetHeight) ? targetHeight : '?'}`;
        command = command.size(size);
      }

      command
        .on('end', () => resolve())
        .on('error', (err: unknown) => reject(err))
        .save(outputPath);
    });

    const nodeStream = createReadStream(outputPath);
    const stream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
    const stats = statSync(outputPath);

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="compressed-${file.name.replace(/\.[^.]+$/, '')}.mp4"`,
        'Content-Length': String(stats.size)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Video compression failed' }, { status: 500 });
  } finally {
    try { unlinkSync(inputPath); } catch {}
    try { unlinkSync(outputPath); } catch {}
  }
}


