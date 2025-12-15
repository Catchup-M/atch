const BubbleMessage = ({
  msg,
  swipedMessage,
  setSwipedMessage,
  index,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}) => {
  const isLongMessage = msg.text && msg.text.length > 50;
  const isMediumMessage = msg.text && msg.text.length > 30 && msg.text.length <= 50;
  const isShortMessage = msg.text && msg.text.length <= 30;

  const showDateBadge = index === 0 || (msg.date !== undefined && msg.date !== null && msg.date !== (msg.prevDate ?? null));

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
          <div style={{
            background: msg.sent ? '#dcf8c6' : '#fff',
            borderRadius: '12px',
            padding: '4px',
            maxWidth: '290px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
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
                  display: 'block'
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

        {/* Text Messages */}
        {!msg.type && (
          <>
            {isLongMessage && (
              <div style={{
                background: msg.sent ? '#dcf8c6' : '#fff',
                borderRadius: '12px',
                padding: '8px 10px 4px 10px',
                maxWidth: '290px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {/* Reply Preview */}
                {msg.replyTo && (
                  <div style={{
                    borderLeft: '3px solid ' + (msg.sent ? '#128C7E' : '#06cf9c'),
                    paddingLeft: '8px',
                    marginBottom: '6px',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    padding: '6px 8px'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: msg.sent ? '#128C7E' : '#06cf9c', marginBottom: '2px' }}>
                      {msg.replyTo.sender}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.replyTo.text}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: '14px', lineHeight: '1.3' }}>
                  {msg.text}
                  <span style={{
                    float: 'right',
                    marginLeft: '6px',
                    fontSize: '11px',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    position: 'relative',
                    bottom: '-3px'
                  }}>
                    {msg.time}
                    {msg.sent && (
                      <svg width="12" height="12" viewBox="0 0 48 48">
                        <path fill="#43A047" d="M40.6 12.1L17 35.7l-9.6-9.6L4.6 29L17 41.3l26.4-26.4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>
            )}

            {isMediumMessage && (
              <div style={{
                background: msg.sent ? '#dcf8c6' : '#fff',
                borderRadius: '12px',
                padding: '8px 10px',
                maxWidth: '85%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {/* Reply Preview */}
                {msg.replyTo && (
                  <div style={{
                    borderLeft: '3px solid ' + (msg.sent ? '#128C7E' : '#06cf9c'),
                    paddingLeft: '8px',
                    marginBottom: '6px',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    padding: '6px 8px'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: msg.sent ? '#128C7E' : '#06cf9c', marginBottom: '2px' }}>
                      {msg.replyTo.sender}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.replyTo.text}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ color: '#111', fontSize: '14px' }}>{msg.text}</span>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}>
                    {msg.time}
                    {msg.sent && (
                      <svg width="12" height="12" viewBox="0 0 48 48">
                        <path fill="#43A047" d="M40.6 12.1L17 35.7l-9.6-9.6L4.6 29L17 41.3l26.4-26.4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>
            )}

            {isShortMessage && (
              <div style={{
                background: msg.sent ? '#dcf8c6' : '#fff',
                borderRadius: '12px',
                padding: '8px 10px',
                maxWidth: '85%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {/* Reply Preview */}
                {msg.replyTo && (
                  <div style={{
                    borderLeft: '3px solid ' + (msg.sent ? '#128C7E' : '#06cf9c'),
                    paddingLeft: '8px',
                    marginBottom: '6px',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    padding: '6px 8px'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: msg.sent ? '#128C7E' : '#06cf9c', marginBottom: '2px' }}>
                      {msg.replyTo.sender}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.replyTo.text}
                    </div>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span style={{ color: '#111', fontSize: '14px', whiteSpace: msg.replyTo ? 'normal' : 'nowrap' }}>{msg.text}</span>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}>
                    {msg.time}
                    {msg.sent && (
                      <svg width="12" height="12" viewBox="0 0 48 48">
                        <path fill="#43A047" d="M40.6 12.1L17 35.7l-9.6-9.6L4.6 29L17 41.3l26.4-26.4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  );
};
