import { IoIosSearch } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";

import { FaBell } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import styles from "./Header.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuthThunk } from "../../../store/thunks/authThunk";
import {
  handleActiveChat,
  handlePushLatestMessage,
  handlePushNotificationChat,
  removeActiveChat,
} from "../../../store/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../lib/toast";
import { useFetch } from "../../../hooks/useFetch";
import { handleRemoveNotificationById } from "../../../store/slices/notificationSlice";
import ModalPortal from "../../../ui/Modal/Modal";
import { useRef } from "react";
import ProfilePicSelection from "../ProfilePicSelection/ProfilePicSelection";

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

  const { fetchData, data, isLoading, error } = useFetch();

  const loggedUser = user;

  const handleLogout = async (e) => {
    e.preventDefault();

    const res = await fetchData("http://localhost:3000/api/auth/logout", {
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

  // const handleChange = async (e) => {
  //     const file = e.target.files[0];

  //     if (!file) return;

  //     const reader = new FileReader();

  //     reader.onloadend = async () => {
  //       const base64String = reader.result;
  //       console.log(base64String);

  //       const res = await fetchData('http://localhost:3000/api/auth/updateProfilePic', {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           userId: user._id,
  //           profilePic: base64String
  //         })
  //       });

  //       if(res) {

  //         console.log(res);
  //       }

  //     };

  //     reader.readAsDataURL(file);
  // };

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
            {/* <div className={`${styles.avatar__container}`}>
              <img
                src={loggedUser.profilePic}
                className={`${styles.single__chat__profile__pic}`}
                alt=""
              />
              <div onClick={() => inputFileRef.current.click()} className={`${styles.edit__profile__pic__icon}`}>
                <MdEdit />
              </div>
              <input
                type="file"
                name="profile__pic"
                accept="image/*"
                ref={inputFileRef}
                className={`${styles.hidden}`}
                onChange={handleChange}
              />
            </div> */}

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

          <div className="nav__right">
            {/* icon */}
            <FaBell
              onClick={() => setShowNotifications(true)}
              onMouseOver={() => setShowNotifications(false)}
              // onMouseLeave={() => setShowNotifications(false)}
              className={`${styles.icon__bell}`}
            />
            {notifications && notifications.length > 0 && (
              <span className={`${styles.badge}`}>{notifications.length}</span>
            )}
            <img
              onClick={() => setShowProfileOptions((prevState) => !prevState)}
              className={`${styles.profile__pic}`}
              src={profilePic || user.profilePic}
              alt=""
            />
            {showProfileOptions && (
              <div className={`${styles.profile__options}`}>
                <span className={`${styles.option}`}>
                  <CgProfile />
                  <p
                    className={`${styles.extra__links}`}
                    // onMouseDown={() => setShowProfileOptions(false)}
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
                    onMouseLeave={() => setShowProfileOptions(false)}
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </span>
              </div>
            )}
            {showNotifications && (
              <div className={`${styles.notifications__container}`}>
                {notifications.length > 0 &&
                  notifications.map((notification, i) => {
                    const handleClickNotification = () => {
                      const matchChat = myChats.find(
                        (c) => c._id == notification.chat._id
                      );

                      dispatch(handleActiveChat(matchChat));
                      dispatch(handleRemoveNotificationById(notification._id));
                      dispatch(
                        handlePushNotificationChat(notification.chat._id)
                      );
                    };

                    return (
                      <p
                        onClick={handleClickNotification}
                        key={i}
                        className={`${styles.notification}`}
                      >
                        New Message from {notification.sender.name}
                      </p>
                    );
                  })}
                {notifications.length == 0 && (
                  <p className={`${styles.notification}`}>No Notifications</p>
                )}
                {/* {
                 ( notifications.length > 0 || true)&&
                <p className={`${styles.notification}`}>New Message from Alu</p>
                } */}
              </div>
            )}
            {/* profilePic */}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
