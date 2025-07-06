import Chat from '../Chat/Chat'
import styles from './Sidebar.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { handleSelectedChat } from '../../../store/slices/chatSlice';

const CHATS = [
  { id: 1, title: 'Sahil Khan', latestMessage: "Check this up!" },
  { id: 2, title: 'Chandan Kumar', latestMessage: "Are you going to College Tommorrow?" },
  { id: 3, title: 'Rahul Kadwe', latestMessage: "Yeah! Let's get that started!" },
];

const Sidebar = () => {
  const { chatId } = useSelector(state => state.selectedChat);
  const dispatch = useDispatch();
  const chats = useSelector(state => state.getChats.chat);

  const handleSelectChat = (id) => {
    dispatch(handleSelectedChat(id));
  };

  return (
    <div className={`${styles.sidebar__container}`}>
        <div className={`${styles.chat__header}`}>
            <h3>My Chats</h3>
            <button>New Group Chat +</button>
        </div>
        <div className={`${styles.chats__container}`}>
          {console.log(chats)}
          {/* {CHATS.map((chat, i) => {
            chat.latestMessage = chat.latestMessage.slice(0, 20).padEnd(22, '...')
            return <Chat key={i} chat={chat} selectedChat={chatId} onSelect={handleSelectChat} />
          })} */}
          {chats.map((chat, i) => {
            // chat.latestMessage = chat.latestMessage.slice(0, 20).padEnd(22, '...')
            return <Chat key={i} chat={chat} selectedChat={chatId} onSelect={handleSelectChat} />
          })}
        </div>
    </div>
  )
}

export default Sidebar