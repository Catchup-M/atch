const ImageViewer = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  if (!isOpen) return null;
  
  const { useState, useRef, useCallback, useEffect } = React;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageTranslateX, setImageTranslateX] = useState(0);
  const [imageTranslateY, setImageTranslateY] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const initialPinchDistance = useRef(null);
  const initialZoom = useRef(1);
  const lastTouchX = useRef(0);
  const lastTouchY = useRef(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const totalPhotos = images.length;

  const resetZoomState = useCallback(() => {
    setImageZoom(1);
    setImageTranslateX(0);
    setImageTranslateY(0);
  }, []);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    resetZoomState();
  }, [currentIndex, resetZoomState]);

  useEffect(() => {
    if (!isOpen) return;

    const preventDefaults = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventDefaults, { passive: false });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('touchmove', preventDefaults);
    };
  }, [isOpen]);

  const getBounds = () => {
    if (!imageRef.current || !containerRef.current) return { maxTranslateX: 0, maxTranslateY: 0 };

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const imgRect = imageRef.current.getBoundingClientRect();
    const imageWidth = imgRect.width / imageZoom;
    const imageHeight = imgRect.height / imageZoom;

    const zoomedWidth = imageWidth * imageZoom;
    const zoomedHeight = imageHeight * imageZoom;

    const maxTranslateX = Math.max(0, (zoomedWidth - containerWidth) / 2);
    const maxTranslateY = Math.max(0, (zoomedHeight - containerHeight) / 2);

    return { maxTranslateX, maxTranslateY };
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalPhotos - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleTouchStart = (e) => {
    if (isTransitioning) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      setIsPinching(true);
      setIsDragging(false);

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      initialPinchDistance.current = distance;
      initialZoom.current = imageZoom;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];

      if (imageZoom > 1) {
        lastTouchX.current = touch.clientX;
        lastTouchY.current = touch.clientY;
      } else {
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        setIsDragging(true);
      }
      setIsPinching(false);
    }
  };

  const handleTouchMove = (e) => {
    if (isTransitioning) return;

    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      e.stopPropagation();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (initialPinchDistance.current) {
        const scale = distance / initialPinchDistance.current;
        const newZoom = Math.max(1, Math.min(3, initialZoom.current * scale));
        setImageZoom(newZoom);
      }
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const { maxTranslateX, maxTranslateY } = getBounds();

      if (imageZoom > 1 && !isPinching) {
        e.preventDefault();

        const deltaX = touch.clientX - lastTouchX.current;
        const deltaY = touch.clientY - lastTouchY.current;

        let newTranslateX = imageTranslateX + deltaX;
        let newTranslateY = imageTranslateY + deltaY;

        newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, newTranslateX));
        newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, newTranslateY));

        setImageTranslateX(newTranslateX);
        setImageTranslateY(newTranslateY);

        lastTouchX.current = touch.clientX;
        lastTouchY.current = touch.clientY;
      } else if (isDragging && imageZoom === 1) {
        const currentX = touch.clientX;
        const diff = currentX - touchStartX.current;
        setTranslateX(diff);

        if (Math.abs(touch.clientY - touchStartY.current) < Math.abs(diff)) {
          e.preventDefault();
        }
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isPinching) {
      initialPinchDistance.current = null;
      initialZoom.current = imageZoom;
      setIsPinching(false);

      const { maxTranslateX, maxTranslateY } = getBounds();
      let newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, imageTranslateX));
      let newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, imageTranslateY));
      setImageTranslateX(newTranslateX);
      setImageTranslateY(newTranslateY);
      return;
    }

    if (!isDragging || imageZoom > 1) return;

    setIsDragging(false);
    const swipeThreshold = 75;

    if (Math.abs(translateX) > swipeThreshold) {
      setIsTransitioning(true);
      if (translateX < 0 && currentIndex < totalPhotos - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }

    setTranslateX(0);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    if (imageZoom > 1) {
      lastTouchX.current = e.clientX;
      lastTouchY.current = e.clientY;
    } else {
      touchStartX.current = e.clientX;
      touchStartY.current = e.clientY;
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && imageZoom === 1) return;

    const { maxTranslateX, maxTranslateY } = getBounds();

    if (imageZoom > 1) {
      const deltaX = e.clientX - lastTouchX.current;
      const deltaY = e.clientY - lastTouchY.current;

      let newTranslateX = imageTranslateX + deltaX;
      let newTranslateY = imageTranslateY + deltaY;

      newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, newTranslateX));
      newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, newTranslateY));

      setImageTranslateX(newTranslateX);
      setImageTranslateY(newTranslateY);

      lastTouchX.current = e.clientX;
      lastTouchY.current = e.clientY;
    } else if (isDragging) {
      const currentX = e.clientX;
      const diff = currentX - touchStartX.current;
      setTranslateX(diff);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || imageZoom > 1) return;

    setIsDragging(false);
    const swipeThreshold = 75;

    if (Math.abs(translateX) > swipeThreshold) {
      setIsTransitioning(true);
      if (translateX < 0 && currentIndex < totalPhotos - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }

    setTranslateX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp();
  };

  const handleImageClick = (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      const newZoom = imageZoom === 1 ? 2 : 1;
      setImageZoom(newZoom);
      if (newZoom === 1) {
        setImageTranslateX(0);
        setImageTranslateY(0);
      }
    }
    setLastTap(now);
  };

  const getWindowWidth = () => {
    return containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={onClose}
            style={{
              color: '#fff',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '600', margin: 0 }}>Daddy Steve</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Nov 16 at 2:17 PM</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              color: '#fff',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <button style={{
              color: '#fff',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>

        {/* Photo Counter */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '24px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px'
          }}>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500', margin: 0 }}>
              {currentIndex + 1} of {totalPhotos}
            </p>
          </div>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: imageZoom > 1 ? 'move' : isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick}
      >
        {/* Current Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: imageZoom === 1 && isDragging && translateX !== 0
              ? `scale(${1 - Math.abs(translateX) / getWindowWidth() * 0.1})`
              : 'scale(1)',
            transition: isDragging || isPinching ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
              transform: `translate(${imageTranslateX}px, ${imageTranslateY}px) scale(${imageZoom})`,
              transition: isPinching || (imageZoom > 1 && lastTouchX.current) ? 'none' : 'transform 300ms ease-out',
              transformOrigin: 'center center'
            }}
            draggable="false"
          />
        </div>

        {/* Next Image */}
        {currentIndex < totalPhotos - 1 && translateX < 0 && imageZoom === 1 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transform: `translateX(${getWindowWidth() + translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <img
              src={images[currentIndex + 1]}
              alt="Next Photo"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              draggable="false"
            />
          </div>
        )}

        {/* Previous Image */}
        {currentIndex > 0 && translateX > 0 && imageZoom === 1 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transform: `translateX(${-getWindowWidth() + translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <img
              src={images[currentIndex - 1]}
              alt="Previous Photo"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              draggable="false"
            />
          </div>
        )}

        {/* Navigation Arrows (Desktop) */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isTransitioning || imageZoom > 1}
          style={{
            display: window.innerWidth >= 768 ? 'block' : 'none',
            position: 'absolute',
            left: '16px',
            color: '#fff',
            padding: '8px',
            background: 'rgba(0,0,0,0.3)',
            border: 'none',
            borderRadius: '50%',
            cursor: currentIndex === 0 || isTransitioning || imageZoom > 1 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 || isTransitioning || imageZoom > 1 ? 0.3 : 1,
            transition: 'background 0.2s',
            zIndex: 30,
            pointerEvents: 'auto'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === totalPhotos - 1 || isTransitioning || imageZoom > 1}
          style={{
            display: window.innerWidth >= 768 ? 'block' : 'none',
            position: 'absolute',
            right: '16px',
            color: '#fff',
            padding: '8px',
            background: 'rgba(0,0,0,0.3)',
            border: 'none',
            borderRadius: '50%',
            cursor: currentIndex === totalPhotos - 1 || isTransitioning || imageZoom > 1 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === totalPhotos - 1 || isTransitioning || imageZoom > 1 ? 0.3 : 1,
            transition: 'background 0.2s',
            zIndex: 30,
            pointerEvents: 'auto'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Caption Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
        pointerEvents: 'none'
      }}>
        <div style={{ padding: '24px' }}>
          <p style={{ color: '#fff', fontSize: '18px', margin: 0 }}>
            Got a new pet 🤷
          </p>
        </div>
      </div>
    </div>
  );
};
