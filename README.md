Image and video compression app built with Next.js API routes.

Getting Started
```bash
bun install
bun dev
```

API routes
- POST `/api/compress-image` fields: file, format, quality, maxWidth, maxHeight
- POST `/api/compress-video` fields: file, videoBitrate, audioBitrate, maxWidth, maxHeight

Notes
- Requires `sharp`, `fluent-ffmpeg`, and `ffmpeg-static`.
- Temp files are written to `./temp` and cleaned after each request.
