export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB — Vercel free plan limit

export interface ImageFormat {
  format: string;
  mime: string;
}

export const OUTPUT_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
};

export function detectFormat(buffer: Buffer): ImageFormat | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { format: 'jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { format: 'png', mime: 'image/png' };
  }

  // WebP: RIFF at 0-3, WEBP at 8-11
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { format: 'webp', mime: 'image/webp' };
  }

  // AVIF: ftyp box at bytes 4-7
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    return { format: 'avif', mime: 'image/avif' };
  }

  // GIF: GIF8
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { format: 'gif', mime: 'image/gif' };
  }

  return null;
}
