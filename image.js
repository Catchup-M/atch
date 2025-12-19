// image.js
const ImageViewer = ({ 
  images, 
  initialIndex, 
  onClose, 
  senderName = "Daddy Steve",
  messageDate = "Nov 16",
  caption = "Photo" 
}) => {
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
  const overlayRef = useRef(null);

  const totalPhotos = images.length;

  const getCurrentImage = (index) => images[index];

  const resetZoomState = useCallback(() => {
    setImageZoom(1);
    setImageTranslateX(0);
    setImageTranslateY(0);
  }, []);

  useEffect(() => {
    resetZoomState();
  }, [currentIndex, resetZoomState]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
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
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      if (initialPinchDistance.current) {
        const scale = distance / initialPinchDistance.current;
        const newZoom = Math.max(1, Math.min(3, initialZoom.current * scale));
        setImageZoom(newZoom);
      }
    } else if (e.touches.length === 1 && imageZoom > 1 && !isPinching) {
      e.preventDefault();
      const touch = e.touches[0];
      const { maxTranslateX, maxTranslateY } = getBounds();
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
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX.current;
      setTranslateX(diff);
      if (Math.abs(e.touches[0].clientY - touchStartY.current) < Math.abs(diff)) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isPinching) {
      initialPinchDistance.current = null;
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

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const getWindowWidth = () => containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;

  const ChevronLeft = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );

  const ChevronRight = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  return (
    <div 
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      onClick={handleOverlayClick}
    >
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={28} />
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {senderName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
              {messageDate}
            </p>
          </div>
          
          <div style={{ width: '56px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '24px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {currentIndex + 1} of {totalPhotos}
          </div>
        </div>
      </div>

      {/* Image Container - Full edge-to-edge width preserved */}
      <div 
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          width: '100vw',
          height: '100vh',
          cursor: imageZoom > 1 ? 'move' : 'grab'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
            src={getCurrentImage(currentIndex)} 
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
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '12px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
          opacity: currentIndex === 0 ? 0.3 : 1,
          zIndex: 30,
          display: totalPhotos > 1 ? 'flex' : 'none'
        }}
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={handleNext}
        disabled={currentIndex === totalPhotos - 1}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '12px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: currentIndex === totalPhotos - 1 ? 'not-allowed' : 'pointer',
          opacity: currentIndex === totalPhotos - 1 ? 0.3 : 1,
          zIndex: 30,
          display: totalPhotos > 1 ? 'flex' : 'none'
        }}
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

// Export for use in main app
window.ImageViewer = ImageViewer;
