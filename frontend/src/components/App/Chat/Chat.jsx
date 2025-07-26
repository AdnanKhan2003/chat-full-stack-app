import { useSelector } from "react-redux";

import { limitString } from "../../../lib/utils.js";
import groupChatImg from "/images/group_chat.png";

import styles from "./Chat.module.css";

const Chat = ({ chat, onSelect }) => {
  const { user } = useSelector((state) => state.isAuth);
  const { activeChat } = useSelector((state) => state.chats);

  const loggedUserId = user?._id;
  const chatPartner = chat.users.find((user) => user._id !== loggedUserId);

  const isActive = activeChat?._id === chat._id;
  const groupChatImage =
    chat.isGroupChat &&
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <div
      onClick={() => onSelect(chat)}
      className={`${styles.chat__container} ${
        isActive ? `${styles.active}` : ""
      }`}
    >

      <img
        className={`${styles.chat__profile__pic}`}
        src={chat.isGroupChat ? groupChatImg : chatPartner.profilePic}
        alt=""
      />
      <div className="chat__content">
        <h4>{chat.chatName === "sender" ? chatPartner.name : chat.chatName}</h4>
        <p>{limitString(chat.latestMessage?.content) || ""}</p>
      </div>
    </div>
  );
};

export default Chat;
