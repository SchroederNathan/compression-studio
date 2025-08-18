import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (data: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      let progress = 0;
      send({ progress, status: 'Starting…' });

      const interval = setInterval(() => {
        progress = Math.min(100, progress + Math.round(Math.random() * 15));
        send({ progress, status: progress >= 100 ? 'Complete' : 'Processing…' });
        if (progress >= 100) {
          clearInterval(interval);
          controller.close();
        }
      }, 500);
    }
  });

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}


