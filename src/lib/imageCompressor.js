/**
 * Compresses an image File in the browser using HTML5 Canvas
 * to avoid HTTP 413 (Payload Too Large) and speed up uploads.
 */
export async function compressImage(file, maxWidth = 1600, maxHeight = 2200, quality = 0.85) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }

  // If already under 700 KB, no compression needed
  if (file.size < 700 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^.]+$/, '.jpg'),
                  {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    } catch (e) {
      console.warn('Image compression fallback:', e);
      resolve(file);
    }
  });
}
