import { IoMdClose } from "react-icons/io";

import styles from "./UserBadge.module.css";

const UserBadge = ({ user, onRemove }) => {
  
  return (
    <span className={`${styles.user}`}>
      <p className="user__name">{user.name}</p>
      <IoMdClose onClick={() => onRemove(user._id)} />
    </span>
  );
};

export default UserBadge;
