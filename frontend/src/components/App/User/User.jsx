import { motion } from "motion/react";

import styles from "./User.module.css";

const User = ({ data, onSelect, editUser = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(-15px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      exit={{ opacity: 0, transform: "translateY(0px)" }}
      onClick={() => onSelect(data, editUser)}
      className={`${styles.results__user__container}`}
    >
      <img src={data.profilePic} className={`${styles.user__profile__pic}`} />
      <div className={`${styles.results__content}`}>
        <h5>{data.name}</h5>
        <p>
          <b>Email:</b> {data.email}
        </p>
      </div>
    </motion.div>
  );
};

export default User;
