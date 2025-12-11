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
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
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
        <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <svg
              style={{ width: '28px', height: '28px', cursor: 'pointer', fill: '#666' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>

            <div style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              marginRight: '28px'
            }}>
              Messages
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f0f0f0',
            borderRadius: '20px',
            padding: '8px 16px'
          }}>
            <svg
              style={{ width: '20px', height: '20px', marginRight: '8px', fill: '#999' }}
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
                fontSize: '16px',
                color: '#999'
              }}
            />
          </div>
        </div>

        <div
          onClick={openChat}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            background: '#fff'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
        >
          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#FF8C42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '20px',
              flexShrink: 0
            }}
          >
            DS
          </div>

          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{ flex: 1, minWidth: 0 }}
          >
            <div
              onMouseDown={(e) => e.preventDefault()}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '4px'
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '600', color: '#000' }}>
                Daddy Steve
              </div>
              <div style={{ fontSize: '14px', color: '#999', flexShrink: 0, marginLeft: '8px' }}>
                Oct 27
              </div>
            </div>
            <div style={{ fontSize: '15px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Daddy Steve joined Telegram
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
