import type { CSSProperties, ImgHTMLAttributes } from "react";

type NextImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  objectFit?: CSSProperties["objectFit"];
  onLoadingComplete?: () => void;
};

export default function Image({
  fill,
  priority,
  sizes: _sizes,
  quality: _quality,
  objectFit,
  onLoadingComplete,
  onLoad,
  alt = "",
  style,
  className,
  ...props
}: NextImageProps) {
  const mergedStyle: CSSProperties = {
    ...style,
    ...(fill
      ? {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }
      : {}),
    ...(objectFit ? { objectFit } : {}),
  };

  return (
    <img
      alt={alt}
      className={className}
      style={mergedStyle}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={(event) => {
        onLoad?.(event);
        onLoadingComplete?.();
      }}
      {...props}
    />
  );
}
