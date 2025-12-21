// image.js

const ImageViewer = ({ images, initialIndex = 0, onClose, sender = "Unknown", allMessages = [] }) => {
  const { useState, useRef, useEffect } = React;
  
  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentSender, setCurrentSender] = useState(sender);
  const [currentDateTime, setCurrentDateTime] = useState('');
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
  
  const getCurrentImage = (index) => {
    return images[index];
  };
  
  // Reset zoom whenever the image index changes
  useEffect(() => {
    setImageZoom(1);
    setImageTranslateX(0);
    setImageTranslateY(0);
    
    // Update sender and date/time based on current image
    if (allMessages && allMessages.length > 0) {
      const imageMessages = allMessages.filter(m => m.type === 'image');
      if (imageMessages[currentIndex]) {
        const currentMsg = imageMessages[currentIndex];
        setCurrentSender(currentMsg.sent ? 'You' : 'Daddy Steve');
        
        // Format date and time
        const date = currentMsg.date || '';
        const time = currentMsg.time || '';
        setCurrentDateTime(`${date}${date && time ? ', ' : ''}${time}`);
      }
    }
  }, [currentIndex, allMessages]);
  
  // Prevent default touch behaviors
  useEffect(() => {
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
  }, []);
  
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
  
  const getWindowWidth = () => {
    return containerRef.current ? containerRef.current.offsetWidth : window.innerWidth;
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getCurrentImage(currentIndex);
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Touch Event Handlers
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
      if (translateX < 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }
    
    setTranslateX(0);
  };
  
  // Mouse Event Handlers
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
      if (translateX < 0 && currentIndex < images.length - 1) {
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
  
  // Double-Tap Zoom Logic
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
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'black',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        <button 
          onClick={onClose}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div style={{ flex: 1, marginLeft: '16px' }}>
          <h1 style={{ color: 'white', fontWeight: '600', fontSize: '18px', margin: 0 }}>{currentSender}</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>{currentDateTime}</p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              marginTop: '8px',
              width: '192px',
              background: 'black',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              border: '1px solid #374151',
              overflow: 'hidden'
            }}>
              <button 
                onClick={handleDownload}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: 'white',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download
              </button>
              <button 
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: 'white',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
              <button 
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: 'white',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1f2937'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                Info
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Container */}
      <div 
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: imageZoom > 1 ? 'move' : 'pointer',
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
            src={getCurrentImage(currentIndex)}
            alt={`Photo ${currentIndex + 1}`}
            draggable="false"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              userSelect: 'none',
              pointerEvents: 'none',
              transform: `translate(${imageTranslateX}px, ${imageTranslateY}px) scale(${imageZoom})`,
              transition: isPinching || (imageZoom > 1 && lastTouchX.current) ? 'none' : 'transform 300ms ease-out',
              transformOrigin: 'center center'
            }}
          />
        </div>

        {/* Next Image */}
        {currentIndex < images.length - 1 && translateX < 0 && imageZoom === 1 && (
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
              src={getCurrentImage(currentIndex + 1)} 
              alt="Next Photo"
              draggable="false"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              }}
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
              src={getCurrentImage(currentIndex - 1)} 
              alt="Previous Photo"
              draggable="false"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Bottom gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '128px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};
