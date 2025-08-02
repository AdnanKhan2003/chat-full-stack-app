import { AnimatePresence, motion } from "motion/react";

import { useSelector } from "react-redux";
import styles from "./Message.module.css";

const Message = ({ message, isUserSender, showAvatar }) => {
  const { user } = useSelector((state) => state.isAuth);
  const loggedUserId = user?._id;

  return (
    <motion.div
      initial={{ y: 15 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className={`${styles.message__container} ${
        isUserSender ? styles.sender : styles.receiver
      }`}
    >
      <AnimatePresence>
        {showAvatar && message.sender?._id !== loggedUserId ? (
          <motion.img
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.51 } }}
            exit={{ y: -15, opacity: 0 }}
            src={message.sender?.profilePic}
            alt=""
            className={`${styles.message__profile__pic}`}
          />
        ) : (
          <div className={`${styles.message__profile__pic}`}></div>
        )}
      </AnimatePresence>

      <p
        className={`${styles.message} ${
          message.sender?._id == loggedUserId ? styles.message__loggedUser : ""
        }`}
      >
        {message.content}
      </p>
    </motion.div>
  );
};

export default Message;
