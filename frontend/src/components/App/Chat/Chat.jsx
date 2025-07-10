import { useSelector } from "react-redux";
import styles from "./Chat.module.css";

const Chat = ({ chat, onSelect }) => {
  const { user } = useSelector(state => state.isAuth);
  const { activeChat } = useSelector(state => state.chats);

  const loggedUserId = user?._id;
  const chatPartner = chat.users.find(user => user._id !== loggedUserId);
 
  const isActive = activeChat._id === chat._id;
  // console.log('activeChat', activeChat);
  // console.log('isActive', isActive);
  
  
  
  return (
    <div
    onClick={() => onSelect(chat)}
      className={`${styles.chat__container} ${isActive ? styles.active : ""}`}
    >
      <img
        className={`${styles.chat__profile__pic}`}
        src={chatPartner.profilePic}
        alt=""
      />
      <div className="chat__content">
        <h4>{chat.chatName === 'sender' ? chatPartner.name : chat.chatName}</h4>
        <p>{chatPartner.latestMessage || "What The Hell Is This!!"}</p>
      </div>
    </div>
  );
};

export default Chat;
