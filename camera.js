// camera.js

const CameraUI = ({ onClose }) => {
  const { useState, useRef, useEffect } = React;
  
  const [mode, setMode] = useState('photo');
  const [flash, setFlash] = useState(false);
  const [grid, setGrid] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const handleCapture = () => {
    if (mode === 'photo') {
      setIsCapturing(true);
      setTimeout(() => setIsCapturing(false), 200);
      console.log('Photo captured!');
    } else {
      console.log('Video recording toggled!');
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: 'black',
      overflow: 'hidden'
    }}>
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Grid Overlay */}
      {grid && (
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: '100%',
          height: '100%'
        }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }} />
          ))}
        </div>
      )}

      {/* Flash Effect */}
      {isCapturing && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'white',
          animation: 'pulse 0.2s ease-out'
        }} />
      )}

      {/* Top Controls */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        zIndex: 10
      }}>
        <button 
          onClick={onClose}
          style={{
            padding: '8px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setFlash(!flash)}
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {flash ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
          
          <button 
            onClick={() => setGrid(!grid)}
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={grid ? '#60a5fa' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: '32px',
        zIndex: 10
      }}>
        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setMode('photo')}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              background: mode === 'photo' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              color: mode === 'photo' ? 'white' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: mode === 'photo' ? 'blur(4px)' : 'none'
            }}
          >
            Photo
          </button>
          <button
            onClick={() => setMode('video')}
            style={{
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              background: mode === 'video' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              color: mode === 'video' ? 'white' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: mode === 'video' ? 'blur(4px)' : 'none'
            }}
          >
            Video
          </button>
        </div>

        {/* Capture Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          {/* Gallery Preview - Static */}
          <button style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
          />

          {/* Capture Button */}
          <button
            onClick={handleCapture}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid white',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          >
            <div style={{
              width: mode === 'video' ? '32px' : '64px',
              height: mode === 'video' ? '32px' : '64px',
              borderRadius: mode === 'video' ? '8px' : '50%',
              background: mode === 'video' ? '#dc2626' : 'white'
            }} />
          </button>

          {/* Switch Camera Button */}
          <button 
            onClick={switchCamera}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
