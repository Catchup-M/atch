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
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#f9fafb' }}>
      {/* Conversation List View */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
          background: '#f9fafb',
          transform: showChat ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s',
          overflowY: 'auto'
        }}
      >
        <div style={{ padding: '8px 24px', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginRight: '16px' }}>
              <svg
                style={{ width: '24px', height: '24px', fill: '#9ca3af' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '18px',
                  color: '#374151',
                  marginLeft: '12px'
                }}
              />
            </div>

            <svg
              style={{ 
                width: '24px', 
                height: '24px', 
                cursor: 'pointer', 
                fill: '#4b5563', 
                padding: '8px', 
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
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
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#fb923c',
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

          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{ 
              flex: 1, 
              minWidth: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginLeft: '12px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                Daddy Steve
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Daddy Steve joined Telegram
              </div>
            </div>
            
            <div style={{ fontSize: '12px', color: '#9ca3af', paddingTop: '4px', paddingRight: '0' }}>
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
