import { IoArrowBackOutline } from "react-icons/io5";

import styles from './EmptyChatMessages.module.css';
import { handleGoToChats } from "../../../../store/slices/chatSlice";
import { useDispatch } from "react-redux";

const EmptyChatMessages = () => {
  const dispatch = useDispatch();

  return (
    <>
      <IoArrowBackOutline
                onClick={() => dispatch(handleGoToChats())}
                className={`${styles.btn__back}`}
              />
    <div className={`${styles.empty__messages__container}`}>
      <div className="content">
        <h4>Select Chats to Message!</h4>
        <p>We Hope that you've the Best Experience</p>
      </div>
    </div>
    </>

  )
}

export default EmptyChatMessages