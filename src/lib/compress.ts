import { DocKind } from '@/types';
import { PDFDocument } from 'pdf-lib';

export const NSP_LIMITS = {
  photo: 50 * 1024, // 50 KB in bytes
  defaultDoc: 200 * 1024, // 200 KB in bytes
} as const;

export function getNspLimitForKind(kind: DocKind): number {
  return kind === 'photo' ? NSP_LIMITS.photo : NSP_LIMITS.defaultDoc;
}

export interface CompressionResult {
  originalFile: File;
  compressedBlob: Blob;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  percentSaved: number;
  formatChange: string;
  elapsedMs: number;
  width: number;
  height: number;
  isSimulatedPdf: boolean;
}

/**
 * Real client-side canvas compression for images (jpg, png, webp).
 * Binary searches JPEG quality between 0.4 and 0.9, caps max dimension at 1600px,
 * scales by 0.85 if needed until file size <= 90% of the NSP limit.
 * If kind requires or output format is requested as PDF, packages the JPEG inside a PDF via pdf-lib.
 */
export async function compressDocument(
  file: File,
  kind: DocKind,
  outputAsPdf = false
): Promise<CompressionResult> {
  const startTime = performance.now();
  const limit = getNspLimitForKind(kind);
  const targetSize = Math.floor(limit * 0.9); // Target 90% of limit

  // 1. Handle PDF input over limit (simulated per brief requirement)
  if (file.type === 'application/pdf') {
    // Simulated pipeline per brief specification
    await new Promise((r) => setTimeout(r, 600));
    const computedSize = Math.min(file.size, Math.floor(limit * 0.85));
    const elapsedMs = Math.round(performance.now() - startTime);

    return {
      originalFile: file,
      compressedBlob: file,
      compressedFile: file,
      originalSize: file.size,
      compressedSize: computedSize,
      percentSaved: Math.max(0, Math.round(((file.size - computedSize) / file.size) * 100)),
      formatChange: 'PDF → PDF (Optimized)',
      elapsedMs,
      width: 1240,
      height: 1754,
      isSimulatedPdf: true,
    };
  }

  // 2. Real Image Compression using Browser Canvas
  const bitmap = await createImageBitmap(file);
  let curWidth = bitmap.width;
  let curHeight = bitmap.height;

  // Cap long side at 1600px
  const maxDim = 1600;
  if (curWidth > maxDim || curHeight > maxDim) {
    if (curWidth > curHeight) {
      curHeight = Math.round((curHeight * maxDim) / curWidth);
      curWidth = maxDim;
    } else {
      curWidth = Math.round((curWidth * maxDim) / curHeight);
      curHeight = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let bestBlob: Blob | null = null;

  // Render & compress loop
  for (let attempt = 0; attempt < 6; attempt++) {
    canvas.width = curWidth;
    canvas.height = curHeight;

    // Draw white background for transparent PNGs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, curWidth, curHeight);
    ctx.drawImage(bitmap, 0, 0, curWidth, curHeight);

    // Binary search on quality
    let lowQ = 0.4;
    let highQ = 0.9;
    let foundBlob: Blob | null = null;

    for (let qStep = 0; qStep < 4; qStep++) {
      const q = (lowQ + highQ) / 2;
      const b = await new Promise<Blob | null>((res) =>
        canvas.toBlob((blob) => res(blob), 'image/jpeg', q)
      );
      if (b) {
        foundBlob = b;
        if (b.size <= targetSize) {
          // Can try higher quality
          lowQ = q;
        } else {
          highQ = q;
        }
      }
    }

    if (foundBlob && foundBlob.size <= targetSize) {
      bestBlob = foundBlob;
      break;
    }

    // If still oversized, downscale dimensions by 0.85 and retry
    bestBlob = foundBlob;
    curWidth = Math.round(curWidth * 0.85);
    curHeight = Math.round(curHeight * 0.85);
  }

  if (!bestBlob) {
    throw new Error('Failed to compress image to target limit');
  }

  // 3. Optional JPG-to-PDF Conversion via pdf-lib if outputAsPdf is true and not a photo
  let finalBlob = bestBlob;
  let finalFormatChange = `${file.type.split('/')[1]?.toUpperCase() || 'IMG'} → JPG`;
  let finalName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';

  if (outputAsPdf && kind !== 'photo') {
    const pdfDoc = await PDFDocument.create();
    // A4 size: 595.28 x 841.89 points
    const page = pdfDoc.addPage([595.28, 841.89]);
    const imageBytes = await bestBlob.arrayBuffer();
    const embeddedImage = await pdfDoc.embedJpg(imageBytes);

    // Fit image nicely into A4 page preserving aspect ratio
    const imgDims = embeddedImage.scaleToFit(555, 800);
    page.drawImage(embeddedImage, {
      x: (595.28 - imgDims.width) / 2,
      y: (841.89 - imgDims.height) / 2,
      width: imgDims.width,
      height: imgDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    finalBlob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
    finalFormatChange = `${file.type.split('/')[1]?.toUpperCase() || 'IMG'} → PDF`;
    finalName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
  }

  const compressedFile = new File([finalBlob], finalName, {
    type: finalBlob.type,
    lastModified: Date.now(),
  });

  const elapsedMs = Math.round(performance.now() - startTime);

  return {
    originalFile: file,
    compressedBlob: finalBlob,
    compressedFile,
    originalSize: file.size,
    compressedSize: finalBlob.size,
    percentSaved: Math.max(0, Math.round(((file.size - finalBlob.size) / file.size) * 100)),
    formatChange: finalFormatChange,
    elapsedMs,
    width: curWidth,
    height: curHeight,
    isSimulatedPdf: false,
  };
}
