import { IoMdClose } from "react-icons/io";

import styles from "./UserBadge.module.css";

const UserBadge = ({ user, onRemove, isAdmin, edit = false }) => {
  return (
    <span className={`${styles.user} ${isAdmin ? styles.user__admin : ""}`}>
      <p className="user__name">{user.name}</p>
      <IoMdClose onClick={() => onRemove(user._id, edit)} />
    </span>
  );
};

export default UserBadge;
