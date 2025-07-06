import styles from './Message.module.css';

const Message = ({ message }) => {
  return (
    <div className={`${styles.message__container}`}>
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" className={`${styles.message__profile__pic}`} />
        <p className={`${styles.message}`}>{message}</p>
    </div>
  )
}

export default Message