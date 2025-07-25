import { useSelector } from 'react-redux';
import styles from './Message.module.css';

const Message = ({ message, isUserSender, showAvatar }) => {
  const { user } = useSelector(state => state.isAuth);
  const loggedUserId = user?._id;
  
  
  return (
    <div className={`${styles.message__container} ${isUserSender ? styles.sender : styles.receiver}`}>
      {
        (showAvatar && message.sender?._id !== loggedUserId) ?
        <img src={message.sender?.profilePic} alt="" className={`${styles.message__profile__pic}`} /> :
        <div className={`${styles.message__profile__pic}`}></div>
      }
        <p className={`${styles.message} ${message.sender?._id == loggedUserId ? styles.message__loggedUser : ""}`}>{message.content}</p>
    </div>
  )
}

export default Message