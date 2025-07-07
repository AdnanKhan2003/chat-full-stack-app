import { capitalizeFirstLetter } from "../../../lib/utils";
import styles from "./Chat.module.css";

const Chat = ({ chat, selectedChat, onSelect }) => {
  name = "asdfdsf";

  return (
    <div
      className={`${styles.chat__container}`}
    >
      <img
        className={`${styles.chat__profile__pic}`}
        src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
        alt=""
      />
      <div className="chat__content">
        <h4>{name}</h4>
        <p>{"What The Hell Is This!!"}</p>
      </div>
    </div>
  );
};

export default Chat;
