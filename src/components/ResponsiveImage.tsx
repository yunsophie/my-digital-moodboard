/** Shared image element for generated candidates, logical dimensions, and slot sizes. */
import type { ComponentPropsWithoutRef } from "react";

import type { ResponsiveImageAsset } from "@/lib/responsive-image";

type Props = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "srcSet" | "width" | "height" | "alt" | "sizes"
> & {
  image: ResponsiveImageAsset;
  alt: string;
  sizes: string;
  maxSourceWidth?: number;
};

/** All image contexts share selection rules while retaining their own crop/slot. */
export function ResponsiveImage({
  image,
  alt,
  sizes,
  maxSourceWidth,
  decoding = "async",
  ...props
}: Props) {
  // Limit thumbnail source sets so the browser cannot reuse a cached large pin
  // candidate for a 40px preview. Full-size contexts use the complete family.
  const smallCandidates = maxSourceWidth
    ? image.candidates.filter((candidate) => candidate.width <= maxSourceWidth)
    : undefined;
  const candidates = smallCandidates?.length ? smallCandidates : image.candidates;
  return (
    <img
      {...props}
      data-image-id={image.id}
      src={maxSourceWidth ? candidates.at(-1)!.src : image.src}
      srcSet={
        maxSourceWidth
          ? candidates.map((candidate) => `${candidate.src} ${candidate.width}w`).join(", ")
          : image.srcSet
      }
      sizes={sizes}
      // Logical dimensions reserve the original aspect ratio even when the
      // browser downloads a smaller candidate with rounded pixel dimensions.
      width={image.width}
      height={image.height}
      alt={alt}
      decoding={decoding}
    />
  );
}
