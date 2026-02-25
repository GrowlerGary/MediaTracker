import clsx from 'clsx';
import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { MediaType } from 'mediatracker-api';

const PosterComponent: FunctionComponent<{
  src?: string;
  href?: string;
  mediaType?: MediaType;
  itemMediaType?: MediaType;
  children?: React.ReactNode;
  className?: string;
}> = (props) => {
  const { src, href, mediaType, itemMediaType, children, className } = props;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!src) {
      // Small delay to prevent flash
      const timer = setTimeout(() => {
        setImageLoaded(true);
        setImageError(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [src]);

  useLayoutEffect(
    () => () => {
      // Cleanup image on unmount to prevent memory leaks
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    },
    []
  );

  const mediaTypeLabel = itemMediaType
    ?.replace('_', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const content = (
    <>
      {/* Actual image */}
      {src && !imageError && (
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable="false"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          className={clsx(
            'absolute inset-0 w-full h-full object-cover transition-all duration-500',
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          )}
        />
      )}

      {/* Loading shimmer */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-800 transition-opacity duration-300',
          imageLoaded ? 'opacity-0' : 'opacity-100'
        )}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton-shimmer opacity-50" />
        )}
      </div>

      {/* Placeholder for missing image */}
      <div
        className={clsx(
          'absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-800 transition-opacity duration-300',
          imageError || (!src && imageLoaded) ? 'opacity-100' : 'opacity-0'
        )}
      >
        <span className="material-icons text-5xl text-surface-400 dark:text-surface-500 mb-2">
          {itemMediaType === 'movie' && 'movie'}
          {itemMediaType === 'tv' && 'tv'}
          {itemMediaType === 'book' && 'menu_book'}
          {itemMediaType === 'audiobook' && 'headphones'}
          {itemMediaType === 'video_game' && 'sports_esports'}
          {!itemMediaType && 'image_not_supported'}
        </span>
        {mediaTypeLabel && (
          <span className="text-xs text-surface-500 dark:text-surface-400 font-medium">
            {mediaTypeLabel}
          </span>
        )}
      </div>

      {/* Hover overlay */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />
    </>
  );

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300',
        tailwindcssAspectRatioForMediaType(mediaType),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {href ? (
        <a
          href={href}
          className="block w-full h-full hover:no-underline"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={clsx(
              'relative w-full h-full transition-transform duration-500 ease-spring',
              tailwindcssAspectRatioForMediaType(itemMediaType),
              isHovered ? 'scale-105' : 'scale-100'
            )}
          >
            {content}
          </div>
        </a>
      ) : (
        <div
          className={clsx(
            'relative w-full h-full',
            tailwindcssAspectRatioForMediaType(itemMediaType)
          )}
        >
          {content}
        </div>
      )}

      {/* Overlay children (badges, buttons, etc.) */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

const tailwindcssAspectRatioForMediaType = (mediaType?: MediaType) => {
  if (mediaType === 'audiobook') {
    return 'aspect-[1/1]';
  }

  if (mediaType === 'video_game') {
    return 'aspect-[3/4]';
  }

  return 'aspect-[2/3]';
};

export { PosterComponent as Poster };
export default PosterComponent;
