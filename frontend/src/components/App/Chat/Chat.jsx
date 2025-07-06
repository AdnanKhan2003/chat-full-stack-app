import { capitalizeFirstLetter } from '../../../lib/utils';
import styles from './Chat.module.css';

const Chat = ({ chat, selectedChat, onSelect }) => {
  const currentUser = chat.users[0];
  const chatPartner = chat.users[1];

  let name = capitalizeFirstLetter(chatPartner.name);
  
  return (
    <div onClick={() => onSelect(chat._id)} className={`${styles.chat__container} ${selectedChat === chat._id ? styles.active : ""}`}>
        <img className={`${styles.chat__profile__pic}`} src={chatPartner.profilePic} alt="" />
        <div className="chat__content">
            <h4>{name}</h4>
            <p>{chatPartner.latestMessage || "What The Hell Is This!!"}</p>
        </div>
    </div>
  )
}

export default Chat