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
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#fff', position: 'relative' }}>
      {/* Conversation List View */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
          background: '#fff',
          transform: showChat ? 'translateX(-100%)' : showCamera ? 'translateY(-100%)' : 'translateX(0)',
          transition: showChat ? 'transform 0.3s' : showCamera ? 'transform 0.3s ease-out' : 'transform 0.3s',
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
            {/* Clock Icon - Message Icon */}
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
              position: 'relative'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd">
                  <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fillRule="nonzero" />
                  <path d="M2,6 C2,4.34315 3.34315,3 5,3 L19,3 C20.6569,3 22,4.34315 22,6 L22,16 C22,17.6569 20.6569,19 19,19 L7.33333,19 L4,21.5 C3.17596,22.118 2,21.5301 2,20.5 L2,6 Z M7,9 C7,8.44772 7.44772,8 8,8 L16,8 C16.5523,8 17,8.44772 17,9 C17,9.55228 16.5523,10 16,10 L8,10 C7.44772,10 7,9.55228 7,9 Z M8,12 C7.44772,12 7,12.4477 7,13 C7,13.5523 7.44772,14 8,14 L11,14 C11.5523,14 12,13.5523 12,13 C12,12.4477 11.5523,12 11,12 L8,12 Z" fill={activeTab === 'clock' ? '#3b82f6' : '#374151'} />
                </g>
              </svg>
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
              position: 'relative'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                <path fill={activeTab === 'users' ? '#3b82f6' : '#374151'} fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m-1.5 8a4 4 0 0 0-4 4c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2a4 4 0 0 0-4-4zm6.8-3.1a5.5 5.5 0 0 0-2.8-6.3c.6-.4 1.3-.6 2-.6a3.5 3.5 0 0 1 .8 6.9m2.2 7.1h.5a2 2 0 0 0 2-2a4 4 0 0 0-4-4h-1.1l-.5.8c1.9 1 3.1 3 3.1 5.2M4 7.5a3.5 3.5 0 0 1 5.5-2.9A5.5 5.5 0 0 0 6.7 11A3.5 3.5 0 0 1 4 7.5M7.1 12H6a4 4 0 0 0-4 4c0 1.1.9 2 2 2h.5a6 6 0 0 1 3-5.2z" clipRule="evenodd"/>
              </svg>
            </button>

            {/* Settings Icon */}
            <button style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
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

        {/* Floating Message Button */}
        <button 
          onClick={openCamera}
          style={{
          position: 'fixed',
          bottom: '24px',
          right: '16px',
          width: '48px',
          height: '48px',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
              <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fillRule="nonzero" />
              <path d="M13.5,3 C18.1944,3 22,6.80558 22,11.5 C22,16.1944 18.1944,20 13.5,20 L13,20 L13,20.99 C13,21.5478 12.5476,22.0005 11.989,22 C9.52884,21.9976 7.03691,21.1771 5.14647,19.4959 C3.23771,17.7984 2.0022,15.2749 2,12.0087 L2,11.5 C2,6.80558 5.80558,3 10.5,3 L13.5,3 Z M8.5,10 C7.67157,10 7,10.6716 7,11.5 C7,12.3284 7.67157,13 8.5,13 C9.32843,13 10,12.3284 10,11.5 C10,10.6716 9.32843,10 8.5,10 Z M15.5,10 C14.6716,10 14,10.6716 14,11.5 C14,12.3284 14.6716,13 15.5,13 C16.3284,13 17,12.3284 17,11.5 C17,10.6716 16.3284,10 15.5,10 Z" fill="#ffffff" />
            </g>
          </svg>
        </button>

        {/* Floating Search Button */}
        <button style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
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
          zIndex: 10
        }}>
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
