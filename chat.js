const ChatView = ({
  messages,
  setMessages,
  showChat,
  closeChat,
  headerDate,
  setHeaderDate,
  showEmojiPicker,
  setShowEmojiPicker
}) => {
  const { useState, useRef, useEffect } = React;
  
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchMoveRef = useRef({ x: 0, y: 0 });
  const [swipedMessage, setSwipedMessage] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [message, setMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [inputHeight, setInputHeight] = useState(43);
  const [replyBarHeight, setReplyBarHeight] = useState(0);
  const replyBarRef = useRef(null);

  const scrollToBottom = (smooth = false) => {
    if (contentRef.current) {
      if (smooth) {
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }
  };

  const isNearBottom = () => {
    if (!contentRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);

      const dateBadges = contentRef.current.querySelectorAll('.date-badge');
      let currentDate = '';

      dateBadges.forEach((badge) => {
        const rect = badge.getBoundingClientRect();
        const headerBottom = 58; // Header height
        if (rect.top <= headerBottom + 10 && rect.bottom >= headerBottom) {
          currentDate = badge.textContent;
        }
      });
      setHeaderDate(currentDate);
    }
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [showChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track reply bar height
  useEffect(() => {
    if (replyBarRef.current) {
      const height = replyBarRef.current.offsetHeight;
      setReplyBarHeight(height);
      // Scroll to bottom when reply bar appears if user is near bottom
      if (isNearBottom()) {
        setTimeout(() => scrollToBottom(true), 50);
      }
    } else {
      setReplyBarHeight(0);
    }
  }, [replyingTo]);

  // Track input height changes
  useEffect(() => {
    if (inputRef.current) {
      const updateHeight = () => {
        const newHeight = Math.min(150, Math.max(43, inputRef.current.scrollHeight + 23));
        if (newHeight !== inputHeight) {
          setInputHeight(newHeight);
          // Scroll to bottom when input grows if user is near bottom
          if (isNearBottom()) {
            setTimeout(() => scrollToBottom(true), 50);
          }
        }
      };
      
      const observer = new MutationObserver(updateHeight);
      observer.observe(inputRef.current, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });
      
      updateHeight();
      
      return () => observer.disconnect();
    }
  }, [message, inputHeight]);

  const sendMessage = () => {
    const textToSend = inputRef.current?.textContent?.trim() || '';

    if (!textToSend) {
      return;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes);

    const newMessage = {
      text: textToSend,
      time: timeString,
      sent: true,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    };

    // Add reply info if replying
    if (replyingTo) {
      newMessage.replyTo = replyingTo;
    }

    setMessages(prevMessages => [...prevMessages, newMessage]);

    if (inputRef.current) {
      inputRef.current.textContent = '';
    }
    setMessage('');
    setReplyingTo(null);
    setInputHeight(43);
  };

  const handleInput = (e) => {
    const text = e.currentTarget.textContent;
    setMessage(text);
    
    // Update height dynamically
    const newHeight = Math.min(150, Math.max(43, e.currentTarget.scrollHeight + 23));
    setInputHeight(newHeight);
  };

  const handleAttachment = () => {
    console.log('Attachment clicked');
  };

  const handleMicrophone = () => {
    console.log('Microphone clicked');
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (!showEmojiPicker) {
      setTimeout(() => scrollToBottom(), 500);
    }
  };

  // Swipe handlers
  const handleTouchStart = (e, index) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e, index, sent) => {
    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      const validSwipe = (sent && deltaX < 0) || (!sent && deltaX > 0);

      if (validSwipe && Math.abs(deltaX) < 80) {
        touchMoveRef.current = { x: deltaX, y: deltaY };
        setSwipedMessage({ index, offset: deltaX });
      }
    }
  };

  const handleTouchEnd = (e, index) => {
    const deltaX = touchMoveRef.current.x;
    const deltaTime = Date.now() - touchStartRef.current.time;

    if (Math.abs(deltaX) < 40 || deltaTime > 300) {
      setSwipedMessage(null);
    } else {
      // Set reply info
      const messageToReply = messages[index];
      setReplyingTo({
        sender: messageToReply.sent ? 'You' : 'Daddy Steve',
        text: messageToReply.text || 'Image',
        imageUrl: messageToReply.imageUrl || null
      });
      setTimeout(() => setSwipedMessage(null), 200);
    }
    touchMoveRef.current = { x: 0, y: 0 };
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
      background: '#f5f5f5',
      backgroundImage: 'url(https://i.ibb.co/1GJJCQRc/telegram-jumbled-symbols-aud1j88vumctm57w-1.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transform: showChat ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Header onClose={closeChat} />

      {headerDate && (
        <div style={{
          position: 'fixed',
          top: '58px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          {headerDate}
        </div>
      )}

      <div
        ref={contentRef}
        style={{
          padding: '70px 18px',
          paddingBottom: showEmojiPicker 
            ? '370px' 
            : `${70 + (inputHeight - 43) + replyBarHeight}px`,
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          transition: showEmojiPicker ? 'padding-bottom 0.3s ease' : 'none',
          position: 'relative',
          zIndex: 1
        }}>
        <div style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          {messages.map((msg, index) => (
            <BubbleMessage
              key={index}
              index={index}
              msg={{ ...msg, prevDate: index > 0 ? messages[index - 1].date : null }}
              swipedMessage={swipedMessage}
              setSwipedMessage={setSwipedMessage}
              handleTouchStart={handleTouchStart}
              handleTouchMove={handleTouchMove}
              handleTouchEnd={handleTouchEnd}
            />
          ))}
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom(true)}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            right: '16px',
            bottom: showEmojiPicker 
              ? '375px' 
              : `${70 + (inputHeight - 43) + replyBarHeight}px`,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#fff',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11,
            transition: showEmojiPicker ? 'bottom 0.3s ease' : 'none'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Input Bar */}
      <div style={{
        position: 'fixed',
        bottom: showEmojiPicker ? '300px' : 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: '#fff',
        border: 'none',
        transition: 'bottom 0.3s ease',
        padding: '6px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: replyingTo ? '8px' : '0'
      }}>
        {/* Reply Bar */}
        {replyingTo && (
          <div 
            ref={replyBarRef}
            style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 8px 8px 8px',
            background: '#FFF5EE',
            borderRadius: '18px',
            borderLeft: '4px solid #FF8C42'
          }}>
            {/* Image Thumbnail */}
            {replyingTo.imageUrl && (
              <img
                src={replyingTo.imageUrl}
                alt="Reply preview"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  marginRight: '8px',
                  flexShrink: 0
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#FF8C42',
                marginBottom: '2px'
              }}>
                {replyingTo.sender}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {replyingTo.text}
              </div>
            </div>
            <svg
              onClick={() => setReplyingTo(null)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fill: '#FF8C42',
                flexShrink: 0
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
        )}
        
        {/* Input Row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end'
        }}>
        <svg
          style={{ width: '25px', height: '29px', marginRight: '10px', marginBottom: '7px', flexShrink: 0, fill: '#666666', cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          onClick={handleAttachment}
          onMouseDown={(e) => e.preventDefault()}
        >
          <g>
            <path fill="#666666" fillRule="evenodd" d="M8 7.308c0-.558.186-1.434.659-2.14C9.1 4.504 9.779 4 10.88 4c1.134 0 1.88.499 2.373 1.155c.52.692.746 1.555.746 2.153v7.54a.8.8 0 0 1-.073.223c-.065.141-.166.3-.3.447c-.269.295-.61.482-1.002.482c-.436 0-.777-.18-1.02-.433c-.263-.274-.355-.574-.355-.72v-7.56a1 1 0 0 0-2 0v7.56c0 .75.358 1.527.912 2.105A3.38 3.38 0 0 0 12.625 18c1.085 0 1.93-.532 2.48-1.134c.517-.567.895-1.335.895-2.02V7.308c0-1.001-.35-2.292-1.146-3.354C14.029 2.856 12.716 2 10.88 2c-1.867 0-3.13.925-3.885 2.055A6.13 6.13 0 0 0 6 7.308v8.695C6 19.402 9.003 22 12.5 22c3.498 0 6.5-2.597 6.5-5.997V7a1 1 0 1 0-2 0v9.003C17 18.123 15.079 20 12.5 20C9.923 20 8 18.122 8 16.003z" clipRule="evenodd" />
          </g>
        </svg>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          background: '#f1f1f1',
          borderRadius: '20px',
          padding: '11.5px 10px',
          minHeight: '43px',
          height: `${inputHeight}px`,
          maxHeight: '150px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <svg
            onClick={toggleEmojiPicker}
            style={{ width: '21px', height: '21px', flexShrink: 0, marginRight: '10px', cursor: 'pointer' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path fill="#666666" d="M464 256a208 208 0 1 0-416 0a208 208 0 1 0 416 0M0 256a256 256 0 1 1 512 0a256 256 0 1 1-512 0m177.3 63.4c15 15.6 41.1 32.6 78.7 32.6s63.7-17 78.7-32.6c9.2-9.6 24.4-9.9 33.9-.7s9.9 24.4.7 33.9c-22.1 23-60 47.4-113.3 47.4s-91.2-24.4-113.3-47.4c-9.2-9.6-8.9-24.8.7-33.9s24.8-8.9 33.9.7M144 208a32 32 0 1 1 64 0a32 32 0 1 1-64 0m192-32a32 32 0 1 1 0 64a32 32 0 1 1 0-64" />
          </svg>

          <div
            ref={inputRef}
            contentEditable
            role="textbox"
            aria-label="Message input"
            onInput={handleInput}
            onFocus={() => {
              setShowEmojiPicker(false);
              setTimeout(() => scrollToBottom(), 500);
            }}
            style={{
              flex: 1,
              fontSize: '14px',
              lineHeight: '20px',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              padding: 0,
              minHeight: '20px',
              maxHeight: '127px',
              overflowY: 'auto'
            }}
          />
        </div>

        <div style={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          {message.trim() === '' ? (
            <svg
              style={{ width: '25px', height: '29px', marginBottom: '7px', fill: '#666666', cursor: 'pointer' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              onClick={handleMicrophone}
              onMouseDown={(e) => e.preventDefault()}
            >
              <path fill="#666666" d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z" />
            </svg>
          ) : (
            <button
              onClick={sendMessage}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '3px'
              }}
            >
              <svg viewBox="0 -0.5 21 21" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z" fill="#3b82f6" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        </div>
      </div>

      {/* Emoji picker placeholder */}
      <div style={{
        position: 'fixed',
        bottom: showEmojiPicker ? 0 : '-300px',
        left: 0,
        right: 0,
        height: '300px',
        background: '#fff',
        zIndex: 9,
        transition: 'bottom 0.3s ease',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* emoji picker content could go here */}
      </div>
    </div>
  );
};
