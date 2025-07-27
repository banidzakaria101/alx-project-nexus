import Image, { ImageProps } from "next/image";
import { useState } from "react";

const ImageFallback = ({ width = 256, height = 384, ...props }: ImageProps) => {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? "/placeholder.png" : props.src}
      width={width}
      height={height}
      onError={() => setError(true)}
      alt={props.alt}
    />
  );
};

export default ImageFallback;