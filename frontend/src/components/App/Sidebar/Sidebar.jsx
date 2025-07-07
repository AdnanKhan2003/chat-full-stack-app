import Chat from '../Chat/Chat'
import styles from './Sidebar.module.css'
import { useDispatch, useSelector } from 'react-redux';


const Sidebar = () => {
  const dispatch = useDispatch();

  const handleSelectChat = (id) => {
  };



  
  return (
    <div className={`${styles.sidebar__container}`}>
        <div className={`${styles.chat__header}`}>
            <h3>My Chats</h3>
            <button>New Group Chat +</button>
        </div>
        <div className={`${styles.chats__container}`}>
          <Chat />
          {/* {chats.length > 0 ? chats.map((chat, i) => {
            // chat.latestMessage = chat.latestMessage.slice(0, 20).padEnd(22, '...')
            return <Chat key={i} chat={chat} selectedChat={chatId} onSelect={handleSelectChat} />
          }) : <h1>No Chats</h1>} */}
        </div>
    </div>
  )
}

export default Sidebar