import sharp from 'sharp';

export interface ImageResult {
  output: Buffer;
  durationMs: number;
}

// sharp.format is the runtime FormatEnum object — keyof gives us valid format string literals.
// The single `as` cast is valid because string overlaps with keyof typeof sharp.format.
type SharpFormat = keyof typeof sharp.format;

export const imageService = {
  async convert(buffer: Buffer, targetFormat: string): Promise<ImageResult> {
    const start = Date.now();
    const fmt = targetFormat as SharpFormat;
    const output = await sharp(buffer).toFormat(fmt).toBuffer();
    return { output, durationMs: Date.now() - start };
  },

  async compress(buffer: Buffer, sourceFormat: string, quality: number): Promise<ImageResult> {
    const start = Date.now();
    const fmt = sourceFormat as SharpFormat;
    const output = await sharp(buffer).toFormat(fmt, { quality }).toBuffer();
    return { output, durationMs: Date.now() - start };
  },

  async resize(
    buffer: Buffer,
    width: number,
    height: number,
    keepAspect: boolean
  ): Promise<ImageResult> {
    const start = Date.now();
    const output = await sharp(buffer)
      .resize({ width, height, fit: keepAspect ? 'inside' : 'fill' })
      .toBuffer();
    return { output, durationMs: Date.now() - start };
  },
};
