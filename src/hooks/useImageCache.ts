import { useState, useEffect } from 'react';

const useImageCache = (src: string | undefined, placeholder: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    const loadImage = () => {
      setImageSrc(src);
      localStorage.setItem(src, 'cached');
    };

    if (localStorage.getItem(src) === 'cached') {
      setImageSrc(src);
    } else {
      img.addEventListener('load', loadImage);
    }

    return () => {
      img.removeEventListener('load', loadImage);
    };
  }, [src, placeholder]);

  return imageSrc;
};

export default useImageCache;
