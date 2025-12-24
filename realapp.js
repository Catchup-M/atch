// app.js

const App = () => {
  const { useState } = React;

  const [messages, setMessages] = useState([
    { text: "Hey!", time: "10:30", sent: true, date: "June 6" },
    { text: "How are you doing today?", time: "10:31", sent: false, date: "June 6" },
    { 
      text: "I'm doing great, thanks for asking!", 
      time: "10:32", 
      sent: true, 
      date: "June 6",
      replyTo: { text: "How are you doing today?", sender: "Daddy Steve" }
    },
    { type: "image", imageUrl: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg", time: "10:33", sent: false, date: "June 6" },
    { 
      text: "That's great to hear!", 
      time: "14:24", 
      sent: false, 
      date: "June 6",
      replyTo: { text: "I'm doing great, thanks for asking!", sender: "You" }
    },
    { text: "Hey bro how are you doing my dear hope everything is going well and you're having a great day", time: "10:33", sent: false, date: "June 6" },
    { 
      text: "Hey", 
      time: "08:22", 
      sent: true, 
      date: "Tuesday",
      replyTo: { text: "Hey bro how are you doing my dear hope everything is going well and you're having a great day", sender: "Mykeespage" }
    },
    { type: "image", imageUrl: "https://i.ibb.co/XxhjB0Ck/2cf0e994-55ca-4f6b-8bf4-c17658a14c37.jpg", time: "17:06", sent: true, date: "Tuesday" },
    { text: "Yes everything is fine", time: "10:34", sent: true, date: "Tuesday" },
  ]);

  const [showChat, setShowChat] = useState(false);
  const [headerDate, setHeaderDate] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState({ images: [], initialIndex: 0, sender: '', allMessages: [] });
  const [activeTab, setActiveTab] = useState('clock'); // 'clock' or 'users'
  const [showCamera, setShowCamera] = useState(false);

  const openChat = () => setShowChat(true);
  const closeChat = () => setShowChat(false);

  const openImageViewer = (images, initialIndex, sender, allMessages = []) => {
    setImageViewerData({ images, initialIndex, sender, allMessages });
    setShowImageViewer(true);
  };

  const closeImageViewer = () => {
    setShowImageViewer(false);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#fff' }}>
      {/* Conversation List View */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
          background: '#fff',
          transform: showChat ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s',
          overflowY: 'auto'
        }}
      >
        {/* Navigation Header */}
        <nav style={{
          background: '#fff',
          padding: '4px 16px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Clock Icon */}
            <button 
              onClick={() => setActiveTab('clock')}
              style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <svg
                style={{ width: '24px', height: '24px', stroke: activeTab === 'clock' ? '#3b82f6' : '#374151', strokeWidth: '2', fill: 'none' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {activeTab === 'clock' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '3px',
                  background: '#3b82f6',
                  borderRadius: '2px'
                }} />
              )}
            </button>

            {/* Users Icon */}
            <button 
              onClick={() => setActiveTab('users')}
              style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                <path fill={activeTab === 'users' ? '#3b82f6' : '#374151'} fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m-1.5 8a4 4 0 0 0-4 4c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2a4 4 0 0 0-4-4zm6.8-3.1a5.5 5.5 0 0 0-2.8-6.3c.6-.4 1.3-.6 2-.6a3.5 3.5 0 0 1 .8 6.9m2.2 7.1h.5a2 2 0 0 0 2-2a4 4 0 0 0-4-4h-1.1l-.5.8c1.9 1 3.1 3 3.1 5.2M4 7.5a3.5 3.5 0 0 1 5.5-2.9A5.5 5.5 0 0 0 6.7 11A3.5 3.5 0 0 1 4 7.5M7.1 12H6a4 4 0 0 0-4 4c0 1.1.9 2 2 2h.5a6 6 0 0 1 3-5.2z" clipRule="evenodd"/>
              </svg>
              {activeTab === 'users' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '3px',
                  background: '#3b82f6',
                  borderRadius: '2px'
                }} />
              )}
            </button>

            {/* Settings Icon */}
            <button style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#374151">
                <g fill="none" fillRule="evenodd">
                  <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                  <path fill="#374151" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2ZM8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0Zm9.758 7.484A7.985 7.985 0 0 1 12 20a7.985 7.985 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984Z"/>
                </g>
              </svg>
            </button>
          </div>
        </nav>

        {/* User Info Card */}
        <div style={{ padding: '8px 0' }}>
          <div
            onClick={openChat}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              background: '#fff',
              padding: '12px 16px'
            }}
          >
            {/* Avatar */}
            <div
              onMouseDown={(e) => e.preventDefault()}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F9B44A 0%, #E8873E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                color: '#fff',
                fontSize: '18px',
                flexShrink: 0
              }}
            >
              DS
            </div>
            
            {/* Text Content */}
            <div
              onMouseDown={(e) => e.preventDefault()}
              style={{ 
                flex: 1,
                minWidth: 0
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Daddy Steve
                </h2>
                <span style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  whiteSpace: 'nowrap'
                }}>
                  Oct 27
                </span>
              </div>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Daddy Steve joined Telegram
              </p>
            </div>
          </div>
        </div>

        {/* Floating Edit Button */}
        <button style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#ffffff" d="m11.4 18.161l7.396-7.396a10.289 10.289 0 0 1-3.326-2.234a10.29 10.29 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.556 6.556 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56c.43-.205.836-.456 1.211-.749c.318-.248.607-.537 1.184-1.114Zm9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.754 8.754 0 0 0 2.092 3.32a8.754 8.754 0 0 0 3.431 2.13l.887-.887Z"/>
          </svg>
        </button>

        {/* Floating Search Button */}
        <button style={{
          position: 'fixed',
          bottom: '92px',
          right: '24px',
          width: '48px',
          height: '48px',
          background: '#fff',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'}>
          <svg
            style={{ width: '20px', height: '20px', fill: 'none', stroke: '#6b7280', strokeWidth: '2' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>

        {/* Floating Camera Button */}
        <button 
          onClick={openCamera}
          style={{
          position: 'fixed',
          bottom: '152px',
          right: '24px',
          width: '48px',
          height: '48px',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26">
            <path fill="#ffffff" d="M10.5 3c-.709 0-1.18.288-1.406.688L7.813 6H6c0-.551-.449-1-1-1H3c-.551 0-1 .449-1 1v.188A2.985 2.985 0 0 0 0 9v10.125A4.874 4.874 0 0 0 4.875 24h16.25A4.874 4.874 0 0 0 26 19.125v-8.25A4.874 4.874 0 0 0 21.125 6h-.938l-1.28-2.313C18.68 3.29 18.18 3 17.5 3h-7zM4 6.5a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 4 6.5zm10 .438a7.063 7.063 0 1 1-.001 14.126A7.063 7.063 0 0 1 14 6.937zm0 2.25a4.812 4.812 0 1 0 0 9.624a4.812 4.812 0 0 0 0-9.625z"/>
          </svg>
        </button>
      </div>

      <CameraView showCamera={showCamera} onClose={closeCamera} />

      <ChatView
        messages={messages}
        setMessages={setMessages}
        showChat={showChat}
        closeChat={closeChat}
        headerDate={headerDate}
        setHeaderDate={setHeaderDate}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        openImageViewer={openImageViewer}
      />

      {showImageViewer && (
        <ImageViewer
          images={imageViewerData.images}
          initialIndex={imageViewerData.initialIndex}
          sender={imageViewerData.sender}
          allMessages={imageViewerData.allMessages}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
