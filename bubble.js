const BubbleMessage = ({
  msg,
  swipedMessage,
  setSwipedMessage,
  index,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  openImageViewer,
  allImages
}) => {
  const isLongMessage = msg.text && msg.text.length > 50;
  const isMediumMessage = msg.text && msg.text.length > 30 && msg.text.length <= 50;
  const isShortMessage = msg.text && msg.text.length <= 30;

  const showDateBadge = index === 0 || (msg.date !== undefined && msg.date !== null && msg.date !== (msg.prevDate ?? null));

  const handleImageClick = () => {
    if (msg.type === 'image' && openImageViewer && allImages) {
      const imageIndex = allImages.findIndex(img => img === msg.imageUrl);
      openImageViewer(allImages, imageIndex);
    }
  };

  return (
    <React.Fragment key={index}>
      {/* Date Badge */}
      {showDateBadge && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '12px',
          marginTop: index === 0 ? '0' : '12px'
        }}>
          <div
            className="date-badge"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {msg.date}
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div
        onTouchStart={(e) => handleTouchStart(e, index)}
        onTouchMove={(e) => handleTouchMove(e, index, msg.sent)}
        onTouchEnd={(e) => handleTouchEnd(e, index)}
        style={{
          display: 'flex',
          justifyContent: msg.sent ? 'flex-end' : 'flex-start',
          marginBottom: '8px',
          transform: swipedMessage?.index === index ? `translateX(${swipedMessage.offset}px)` : 'translateX(0)',
          transition: swipedMessage?.index === index ? 'none' : 'transform 0.2s ease'
        }}
      >
        {/* Image Message */}
        {msg.type === 'image' && (
          <div 
            onClick={handleImageClick}
            style={{
              background: msg.sent ? '#dcf8c6' : '#fff',
              borderRadius: '12px',
              padding: '4px',
              maxWidth: '290px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '280px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img
                src={msg.imageUrl}
                alt="Message image"
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '10px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{
                  fontSize: '13px',
                  color: '#fff',
                  fontWeight: '500'
                }}>
                  {msg.time}
                </span>
                {msg.sent && (
                  <svg width="16" height="12" viewBox="0 0 48 48">
                    <path fill="#fff" d="M40.6 12.1L17 35.7l-9.6-9.6L4.6 29L17 41.3l26.4-26.4z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Text Messages - Rest of your existing code stays the same */}
        {!msg.type && (
          <>
            {/* ... keep all your existing text message code ... */}
          </>
        )}
      </div>
    </React.Fragment>
  );
