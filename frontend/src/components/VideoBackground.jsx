import { useState, useRef, useEffect } from 'react';

/**
 * Enhanced Video Background Component
 * Provides a reusable video background with loading states, error handling, and responsive design
 */
const VideoBackground = ({
  src = "/videos/globalnetwork.mov",
  poster = "/images/video-poster.jpg",
  className = "",
  containerClassName = "",
  size = "desktop", // "desktop", "mobile", "full"
  showOverlay = true,
  aspectRatio = "16/9",
  ariaLabel = "Background video",
  onLoad = null,
  onError = null,
  autoPlay = true,
  loop = true,
  muted = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Size-based styling
  const getSizeClasses = () => {
    switch (size) {
      case "mobile":
        return "w-full max-w-sm mx-auto h-48";
      case "full":
        return "w-full h-full";
      case "desktop":
      default:
        return "w-full max-w-4xl mx-auto h-auto";
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "relative group";
    const sizeClasses = getSizeClasses();
    return `${baseClasses} ${sizeClasses} ${containerClassName}`;
  };

  const getVideoClasses = () => {
    const baseClasses = "w-full rounded-2xl shadow-2xl border border-white/10 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] animate-fade-in";
    const sizeSpecificClasses = size === "mobile" 
      ? "h-48 object-cover rounded-xl shadow-xl" 
      : "h-auto";
    return `${baseClasses} ${sizeSpecificClasses} ${className}`;
  };

  return (
    <div ref={containerRef} className={getContainerClasses()}>
      {/* Gradient Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 rounded-2xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Video Element */}
      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className={getVideoClasses()}
          style={{
            aspectRatio: aspectRatio,
            objectFit: size === "mobile" ? 'cover' : 'contain'
          }}
          aria-label={ariaLabel}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        />
      )}
      
      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl flex items-center justify-center animate-pulse">
          <div className="text-white/60 text-sm">Loading video...</div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-2xl flex flex-col items-center justify-center">
          <div className="text-white/60 text-sm mb-2">Video unavailable</div>
          <div className="text-white/40 text-xs">Please check your connection</div>
        </div>
      )}
      
      {/* Placeholder when not in view */}
      {!isInView && (
        <div 
          className={getVideoClasses()}
          style={{
            aspectRatio: aspectRatio,
            backgroundColor: '#1e293b'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/40 text-sm">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
