/**
 * Client-Side WebP Image Compressor for DISFRUTAR 2K26
 * Max dimension 800px, WebP quality 0.7
 * Produces both Blob (for Firebase Storage) and ultra-compact Data URL (for Firestore fallback)
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  sizeKB: number;
  originalSizeKB: number;
  reductionPercentage: number;
}

/**
 * Convert any File or Blob object into a base64 Data URL
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}


export async function compressPaymentScreenshot(
  file: File,
  maxDimension = 800,
  quality = 0.7
): Promise<CompressionResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Maintain aspect ratio while scaling down
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get 2D canvas context"));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed WebP data URL
        const dataUrl = canvas.toDataURL("image/webp", quality);

        // Convert to Blob and File object
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              const arr = dataUrl.split(",");
              const mimeMatch = arr[0].match(/:(.*?);/);
              const mime = mimeMatch ? mimeMatch[1] : "image/webp";
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              const fallbackBlob = new Blob([u8arr], { type: mime });
              const compressedFile = new File([fallbackBlob], `receipt_${Date.now()}.webp`, {
                type: "image/webp",
              });
              const sizeKB = Math.round(compressedFile.size / 1024);
              const reductionPercentage = Math.round(
                ((originalSizeKB - sizeKB) / originalSizeKB) * 100
              );
              resolve({
                file: compressedFile,
                dataUrl,
                sizeKB,
                originalSizeKB,
                reductionPercentage: Math.max(0, reductionPercentage),
              });
              return;
            }

            const compressedFile = new File([blob], `receipt_${Date.now()}.webp`, {
              type: "image/webp",
            });
            const sizeKB = Math.round(compressedFile.size / 1024);
            const reductionPercentage = Math.round(
              ((originalSizeKB - sizeKB) / originalSizeKB) * 100
            );

            resolve({
              file: compressedFile,
              dataUrl,
              sizeKB,
              originalSizeKB,
              reductionPercentage: Math.max(0, reductionPercentage),
            });
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}
