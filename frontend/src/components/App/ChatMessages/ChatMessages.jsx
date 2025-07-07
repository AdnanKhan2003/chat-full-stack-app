import { useSelector } from 'react-redux';
import { BsSend } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { useState } from 'react';

import Message from './Message/Message.jsx';
import styles from './ChatMessages.module.css';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [ messageInput, setMessageInput ] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

  setMessages(prevMessages => [ ...prevMessages, messageInput ]);
  console.log(messageInput);
  setMessageInput("");
  
  };


  return (
    <div className={`${styles.chat__messages__container}`}>
        <div className={`${styles.chat__message__header}`}>
          <IoArrowBackOutline className={`${styles.btn__back}`} />
          <h3 className="message__receiver">Vela</h3>
          <IoEye />
        </div>

        <div className={`${styles.chat__messages__list}`}>
          {messages.map((msg, i) => <Message key={i} message={msg} />)}
        </div>
        
        <div className={`${styles.chat__messages__footer}`}>
          <form onSubmit={handleSendMessage} className={`${styles.chat__messages__input__container}`}>
            <input 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            type="text" name="message" />
            <button>
              <BsSend />
            </button>
          </form>
        </div>
    </div>
  )
}

export default ChatMessages