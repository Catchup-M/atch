// camera.js

const CameraView = ({ showCamera, onClose }) => {
  const { useState, useRef, useEffect } = React;
  
  const [flashOn, setFlashOn] = useState(false);
  const [mode, setMode] = useState('photo');
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [facingMode, showCamera]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: mode === 'video'
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg');
  };

  const startRecording = async () => {
    if (!stream) return;

    // Get audio stream for video recording
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const combinedStream = new MediaStream([
      ...stream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ]);

    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm'
    });
    
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Stop audio tracks
      audioStream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }
  };

  const handleCapture = () => {
    if (mode === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (isRecording) {
      stopRecording();
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'black',
      zIndex: 3000,
      transform: showCamera ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s ease-out',
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
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Top Header */}
      <div style={{
        width: '100%',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        {/* Back Arrow */}
        <button 
          onClick={handleClose}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg 
            style={{ width: '24px', height: '24px', stroke: 'white', fill: 'none' }}
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Timer Display */}
        {mode === 'video' && (
          <div style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            {isRecording ? formatTime(recordingTime) : '00:00'}
          </div>
        )}

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '16px' }}>
          {/* Flash Icon */}
          <button 
            onClick={() => setFlashOn(!flashOn)}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg 
              style={{ width: '24px', height: '24px', stroke: 'white', fill: flashOn ? 'white' : 'none' }}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              {!flashOn && <line x1="2" y1="2" x2="22" y2="22"/>}
            </svg>
          </button>

          {/* Grid Icon */}
          <button style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}>
            <svg 
              style={{ width: '24px', height: '24px', stroke: 'white', fill: 'none' }}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
        width: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '24px',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        {/* Mode Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <button 
            onClick={() => setMode('photo')}
            style={{
              padding: '4px 16px',
              borderRadius: '20px',
              background: mode === 'photo' ? '#4b5563' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Photo
          </button>
          <button 
            onClick={() => setMode('video')}
            style={{
              padding: '4px 16px',
              borderRadius: '20px',
              background: mode === 'video' ? '#4b5563' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Video
          </button>
        </div>

        {/* Camera Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px'
        }}>
          {/* Gallery Preview */}
          <button style={{
            width: '56px',
            height: '56px',
            borderRadius: '8px',
            background: 'black',
            border: 'none',
            cursor: 'pointer'
          }} />

          {/* Shutter Button */}
          <button 
            onClick={handleCapture}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid white',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <div style={{
              width: mode === 'video' && isRecording ? '32px' : '64px',
              height: mode === 'video' && isRecording ? '32px' : '64px',
              borderRadius: mode === 'video' && isRecording ? '4px' : '50%',
              background: mode === 'video' ? '#dc2626' : 'white'
            }} />
          </button>

          {/* Flip Camera Button */}
          <button 
            onClick={switchCamera}
            style={{
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            <svg 
              style={{ width: '24px', height: '24px', stroke: 'white', fill: 'none' }}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
