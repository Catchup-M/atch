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
    { type: "image", imageUrl: "https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg", time: "17:06", sent: true, date: "Tuesday" },
    { text: "Yes everything is fine", time: "10:34", sent: true, date: "Tuesday" },
  ]);

  const [showChat, setShowChat] = useState(false);
  const [headerDate, setHeaderDate] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const openChat = () => setShowChat(true);
  const closeChat = () => setShowChat(false);

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
        <div style={{ padding: '10px 20px', background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg
                  style={{ width: '22px', height: '22px', fill: 'none', stroke: '#6b6b6b', strokeWidth: '2' }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <span style={{ fontSize: '16px', color: '#6b6b6b', fontWeight: 'normal' }}>Search</span>
            </div>

            <button style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg
                style={{ width: '22px', height: '22px', fill: 'none', stroke: '#6b6b6b', strokeWidth: '2' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div
          onClick={openChat}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px 24px',
            cursor: 'pointer',
            background: '#fff'
          }}
        >
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
              fontWeight: '500',
              color: '#fff',
              fontSize: '20px',
              flexShrink: 0
            }}
          >
            DS
          </div>

          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{ 
              flex: 1, 
              minWidth: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginLeft: '12px',
              paddingBottom: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'normal', color: '#000', marginBottom: '10px' }}>
                Daddy Steve
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Daddy Steve joined Telegram
              </div>
            </div>
            
            <div style={{ fontSize: '14px', color: '#9ca3af', paddingTop: '8px', paddingRight: '0' }}>
              Oct 27
            </div>
          </div>
        </div>
      </div>

      <ChatView
        messages={messages}
        setMessages={setMessages}
        showChat={showChat}
        closeChat={closeChat}
        headerDate={headerDate}
        setHeaderDate={setHeaderDate}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

