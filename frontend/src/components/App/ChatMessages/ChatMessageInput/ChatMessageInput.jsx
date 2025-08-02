import { BsSend } from "react-icons/bs";
import { useEffect, useState } from "react";

import styles from "./ChatMessageInput.module.css";
import TypingIndicator from "../../../../ui/TypingIndicator/TypingIndicator";
import { useRef } from "react";

const ChatMessageInput = ({
  socket,
  activeChat,
  socketConnected,
  draft,
  onDraftChange,
  onSend,
}) => {
  const typingTimeoutRef = useRef();
  const [isCurrentUsertyping, setIsCurrentUsertyping] = useState(false);
  const [isChatPartnertyping, setIsChatPartnertyping] = useState(false);

  useEffect(() => {
    setIsChatPartnertyping(false);
  }, [activeChat]);

  useEffect(() => {
    if (!socket) return;

    const handleStartTyping = (chatId) => {
      if (chatId == activeChat._id) {
        setIsChatPartnertyping(true);
      }
    };

    const handleStopTyping = (chatId) => {
      if (chatId == activeChat._id) {
        setIsChatPartnertyping(false);
      }
    };

    socket.on("start typing", handleStartTyping);
    socket.on("stop typing", handleStopTyping);

    return () => {
      socket.off("start typing");
      socket.off("stop typing");
    };
  }, [socket, activeChat?._id]);

  const handleChangeInput = (val) => {
    onDraftChange(val);

    if (!isCurrentUsertyping) {
      setIsCurrentUsertyping(true);
      socket.emit("start typing", activeChat._id);
    }

    const timer = 1500;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", activeChat._id);
      setIsCurrentUsertyping(false);
      setIsChatPartnertyping(false);
    }, timer);
  };

  return (
    <>
      {socketConnected && isChatPartnertyping && activeChat && (
        <TypingIndicator />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(e);
        }}
        className={`${styles.chat__messages__input__container}`}
      >
        <div>
          <input
            value={draft}
            placeholder="Type a message.."
            onChange={(e) => handleChangeInput(e.target.value)}
            onBlur={() => {
              socket.emit("stop typing", activeChat._id);
              setIsCurrentUsertyping(false);
            }}
            type="text"
            name="message"
          />
          <button>
            <BsSend className={`${styles.btn__send}`} />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatMessageInput;
