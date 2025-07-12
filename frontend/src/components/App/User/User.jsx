import { useDispatch } from 'react-redux';

import styles from "./User.module.css";
import { useNavigate } from 'react-router';

const User = ({ data, onSelect, editUser = false }) => {
  return (
    <div onClick={() => onSelect(data, editUser)} className={`${styles.results__user__container}`}>
      <img
        src={data.profilePic}
        className={`${styles.user__profile__pic}`}
      />
      <div className={`${styles.results__content}`}>
        <h5>{data.name}</h5>
        <p><b>Email:</b> {data.email}</p>
      </div>
    </div>
  );
};

export default User;
