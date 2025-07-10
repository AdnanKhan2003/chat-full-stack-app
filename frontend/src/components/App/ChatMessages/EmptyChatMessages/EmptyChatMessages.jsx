import styles from './EmptyChatMessages.module.css';

const EmptyChatMessages = () => {
  return (
    <div className={`${styles.empty__messages__container}`}>
      <div className="content">
        <h4>Select Chats to Message!</h4>
        <p>We Hope that you've the Best Experience</p>
      </div>
    </div>
  )
}

export default EmptyChatMessages