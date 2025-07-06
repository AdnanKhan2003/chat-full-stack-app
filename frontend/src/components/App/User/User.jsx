import { useDispatch } from 'react-redux';

import styles from "./User.module.css";
import { createChatThunk } from '../../../store/thunks/chatThunk';
import { useNavigate } from 'react-router';
import { clearUsers } from '../../../store/slices/getUsersSlice';

const User = ({ data }) => {
  const { profilePic, email } = data;
  let { name } = data;
  name = name[0].toUpperCase() + name.slice(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectChat = (e) => {
    e.preventDefault();

    dispatch(createChatThunk(data._id));
    dispatch(clearUsers())

    navigate('/');
  };

  

  return (
    <div onClick={handleSelectChat} className={`${styles.results__user__container}`}>
      <img
        src={profilePic}
        className={`${styles.user__profile__pic}`}
      />
      <div className={`${styles.results__content}`}>
        <h5>{name}</h5>
        <p><b>Email:</b> {email}</p>
      </div>
    </div>
  );
};

export default User;
