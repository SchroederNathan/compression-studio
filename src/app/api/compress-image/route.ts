import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';

type ImageOptions = {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
};

async function compressImageBuffer(input: Buffer, opts: ImageOptions): Promise<Buffer> {
  const quality = typeof opts.quality === 'number' ? Math.max(1, Math.min(100, opts.quality)) : 80;
  const maxWidth = opts.maxWidth && opts.maxWidth > 0 ? opts.maxWidth : undefined;
  const maxHeight = opts.maxHeight && opts.maxHeight > 0 ? opts.maxHeight : undefined;
  const target = sharp(input, { failOn: 'none' });

  if (maxWidth || maxHeight) {
    target.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  const format = opts.format || 'jpeg';
  switch (format) {
    case 'png':
      target.png({ compressionLevel: 9, quality });
      break;
    case 'webp':
      target.webp({ quality });
      break;
    case 'avif':
      target.avif({ quality });
      break;
    default:
      target.jpeg({ quality });
  }

  return target.toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const format = (formData.get('format') as string) as ImageOptions['format'];
    const quality = Number(formData.get('quality'));
    const maxWidth = Number(formData.get('maxWidth'));
    const maxHeight = Number(formData.get('maxHeight'));

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const compressed = await compressImageBuffer(inputBuffer, {
      format: format && ['jpeg', 'png', 'webp', 'avif'].includes(format) ? format : 'jpeg',
      quality: Number.isFinite(quality) ? quality : 80,
      maxWidth: Number.isFinite(maxWidth) ? maxWidth : undefined,
      maxHeight: Number.isFinite(maxHeight) ? maxHeight : undefined
    });

    const outExt = (format && ['jpeg', 'png', 'webp', 'avif'].includes(format)) ? format : 'jpeg';
    const contentType = outExt === 'jpeg' ? 'image/jpeg' : `image/${outExt}`;

    const blob = new Blob([new Uint8Array(compressed)], { type: contentType });

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="compressed-${file.name.replace(/\.[^.]+$/, '')}.${outExt === 'jpeg' ? 'jpg' : outExt}"`,
        'Content-Length': String(compressed.length)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Compression failed' }, { status: 500 });
  }
}


