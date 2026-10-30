import React, { useEffect, useState } from 'react';

interface CardImageProps {
  src?: string;
  alt: string;
  /** Icon shown when there is no image or it fails to load. */
  icon: React.ReactNode;
  className?: string;
}

/**
 * Cover image for feature cards. Falls back to a neutral placeholder with the feature's icon when
 * the item has no image or the URL fails, instead of showing the browser's broken-image alt text.
 */
const CardImage: React.FC<CardImageProps> = ({ src, alt, icon, className = '' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        role="img"
        aria-label={`${alt} (no image)`}
      >
        <span className="[&>svg]:w-12 [&>svg]:h-12">{icon}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default CardImage;
