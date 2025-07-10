import { useSelector } from "react-redux";
import { BsSend } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { useState } from "react";

import Message from "./Message/Message.jsx";
import EmptyChatMessages from "./EmptyChatMessages/EmptyChatMessages.jsx";
import styles from "./ChatMessages.module.css";

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { activeChat } = useSelector((state) => state.chats);
  const w = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.isAuth);

  const handleSendMessage = (e) => {
    e.preventDefault();

    setMessages((prevMessages) => [...prevMessages, messageInput]);
    setMessageInput("");
  };

  
  const loggedUserId = user?._id;
  const chatPartner = activeChat && activeChat.users && activeChat?.users?.find(user => user._id !== loggedUserId);


   
  
  return (
    <div className={`${styles.chat__messages__container}`}>
      {activeChat === "" && <EmptyChatMessages />}
      {activeChat !== undefined && activeChat !== "" && (
        <>
          <div className={`${styles.chat__message__header}`}>
            <IoArrowBackOutline className={`${styles.btn__back}`} />
            <h3 className="message__receiver">{
              activeChat.isGroupChat ? activeChat.chatName : chatPartner.name
              }</h3>
            <IoEye />
          </div>

          <div className={`${styles.chat__messages__list}`}>
            {messages.map((msg, i) => (
              <Message key={i} message={msg} />
            ))}
          </div>

          <div className={`${styles.chat__messages__footer}`}>
            <form
              onSubmit={handleSendMessage}
              className={`${styles.chat__messages__input__container}`}
            >
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                type="text"
                name="message"
              />
              <button>
                <BsSend />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessages;
