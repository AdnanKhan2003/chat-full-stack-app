import { AnimatePresence, motion } from "motion/react";

import { IoIosSearch } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";

import { FaBell } from "react-icons/fa";

import styles from "./Header.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthThunk } from "../../../store/thunks/authThunk";
import {
  handleActiveChat,
  handlePushNotificationChat,
  removeActiveChat,
  triggerRefetch,
} from "../../../store/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../lib/toast";
import { useFetch } from "../../../hooks/useFetch";
import { handleRemoveNotificationById } from "../../../store/slices/notificationSlice";
import ModalPortal from "../../../ui/Modal/Modal";
import { useRef } from "react";
import ProfilePicSelection from "../ProfilePicSelection/ProfilePicSelection";
import { myChatThunk } from "../../../store/thunks/myChatThunk ";
import { ENDPOINT_API } from "../../../lib/utils";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const profilePic = useSelector((state) => state.isAuth.user.profilePic);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputFileRef = useRef();

  const { notifications } = useSelector((state) => state.notifications);
  const { myChats, activeChat } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.isAuth);

  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { fetchData } = useFetch();

  const loggedUser = user;

  const handleLogout = async (e) => {
    e.preventDefault();

    const res = await fetchData(`${ENDPOINT_API}/auth/logout`, {
      method: "POST",
    });

    if (res) {
      setShowProfileOptions(false);
      dispatch(checkAuthThunk());
      localStorage.removeItem("persistentActiveChatId");
      showToast({
        type: "success",
        title: "Logout Sucessful!",
        message: "We would Love to See You Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
      localStorage.removeItem("persistentActiveChatId");
      dispatch(removeActiveChat());
      navigate("/login");
    } else {
      showToast({
        type: "error",
        title: "Logout Failed`!",
        message: "Please Try Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
    }
  };

  return (
    <>
      {showModal && (
        <ModalPortal onClose={setShowModal} showModal={showModal}>
          <div className={`${styles.single__chat__details}`}>
            <ProfilePicSelection
              loggedUser={loggedUser}
              // onChange={handleChange}
              ref={inputFileRef}
            />
            <h4>{loggedUser.name}</h4>
            <p>{loggedUser.email}</p>
          </div>
        </ModalPortal>
      )}
      <header className={`${styles.main__header}`}>
        <nav className={`${styles.main__navbar}`}>
          <IoIosSearch
            className={`${styles.search__mobile}`}
            onClick={() => navigate("/search")}
          />
          <div
            title="Search Users To Chat"
            className={`${styles.search__input__container}`}
          >
            <IoIosSearch />
            <input
              type="search"
              name="searchUsers"
              readOnly
              onClick={() => navigate("/search")}
              placeholder="Search Users.."
            />
          </div>

          <div className={`${styles.app__name}`}>
            <h1>TalkAbit</h1>
          </div>

          <div className={`${styles.nav__right}`}>
            <div
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <FaBell
                onClick={() => setShowNotifications((prev) => !prev)}
                className={`${styles.icon__bell}`}
              />

              <AnimatePresence>
                {notifications && notifications.length > 0 && (
                  <motion.span
                    initial={{ y: -10, opacity: 0, duration: 0.3 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className={`${styles.badge}`}
                  >
                    {notifications.length}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    className={`${styles.notifications__container}`}
                  >
                    {notifications.length > 0 &&
                      notifications.map((notification, i) => {
                        const handleClickNotification = async () => {
                          let matchChat = myChats.find(
                            (c) => c._id == notification.chat._id
                          );

                          if (!matchChat) {
                            const result = await dispatch(myChatThunk);
                            if (myChatThunk.fulfilled.match(result)) {
                              matchChat = result.payload.find(
                                (c) =>
                                  c._id.toString() ===
                                  notification.chat._id.toString()
                              );
                            }
                          }

                          if (matchChat) {
                            dispatch(handleActiveChat(matchChat));
                          } else {
                            dispatch(handleActiveChat(notification.chat));
                          }

                          dispatch(
                            handleRemoveNotificationById(notification._id)
                          );
                          dispatch(triggerRefetch(true));
                          dispatch(handlePushNotificationChat(notification));
                        };

                        return (
                          <motion.p
                            initial={{ y: -15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 0, scale: -1 }}
                            transition={{ duration: 0.53 }}
                            onClick={handleClickNotification}
                            key={i}
                            className={`${styles.notification}`}
                          >
                            New Message from {notification.sender.name}
                          </motion.p>
                        );
                      })}
                    {notifications.length == 0 && (
                      <p className={`${styles.notification}`}>
                        No Notifications
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div
              onMouseEnter={() => setShowProfileOptions(true)}
              onMouseLeave={() => setShowProfileOptions(false)}
            >
              {console.log(profilePic, user.profilePic)}
              <img
                onClick={() => setShowProfileOptions((prevState) => !prevState)}
                className={`${styles.profile__pic}`}
                src={profilePic || user.profilePic}
                alt=""
              />

              <AnimatePresence>
                {showProfileOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    className={`${styles.profile__options}`}
                  >
                    <span className={`${styles.option}`}>
                      <CgProfile />
                      <p
                        className={`${styles.extra__links}`}
                        onClick={(e) => {
                          e.stopPropagation();

                          setShowModal(true);
                          setShowProfileOptions(false);
                        }}
                      >
                        My Profile
                      </p>
                    </span>
                    <span className={`${styles.option}`}>
                      <SlLogout />
                      <p
                        className={`${styles.extra__links}`}
                        onClick={handleLogout}
                      >
                        Logout
                      </p>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* profilePic */}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
