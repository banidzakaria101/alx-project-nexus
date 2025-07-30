import Image from "next/image";
import { useState } from "react";

interface ImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

function ImageFallback({ src, alt, className }: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={300}
      height={450}
      className={className}
      onError={() => {
        setImgSrc("/placeholder.jpeg");
      }}
      priority={false}
      unoptimized={true}
    />
  );
}

export default ImageFallback;