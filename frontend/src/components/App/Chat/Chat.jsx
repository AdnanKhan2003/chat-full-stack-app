import { motion } from "motion/react";

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

  return (
    <motion.div
      initial={{ y: -15 }}
      animate={{
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      }}
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
    </motion.div>
  );
};

export default Chat;
