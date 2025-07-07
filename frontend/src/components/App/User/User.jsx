import { useDispatch } from 'react-redux';

import styles from "./User.module.css";
import { useNavigate } from 'react-router';

const User = ({ data }) => {


  const handleSelectChat = (e) => {
    e.preventDefault();


  };

  

  return (
    <div onClick={handleSelectChat} className={`${styles.results__user__container}`}>
      <img
        src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
        className={`${styles.user__profile__pic}`}
      />
      <div className={`${styles.results__content}`}>
        <h5>name</h5>
        <p><b>Email:</b> email</p>
      </div>
    </div>
  );
};

export default User;
