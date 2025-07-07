import { IoIosSearch } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { FaBell } from "react-icons/fa";

import styles from "./Header.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthThunk } from "../../../store/thunks/authThunk";
import { useDispatch } from "react-redux";
import { showToast } from "../../../lib/toast";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout User Failed!");
      }

      const data = res.json();
      console.log(data.message);
      setShowProfileOptions(false);
      dispatch(checkAuthThunk());
      showToast({
        type: "success",
        title: "Logout Sucessful!",
        message: "We would Love to See You Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
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
      <header className={`${styles.main__header}`}>
        <nav className={`${styles.main__navbar}`}>
          <div className={`${styles.search__input__container}`}>
            <IoIosSearch />
            <input
              type="search"
              name="searchUsers"
              onClick={() => navigate("/search")}
              placeholder="Search Users.."
            />
          </div>

          <div className={`${styles.app__name}`}>
            <h1>TalkAbit</h1>
          </div>

          <div className="nav__right">
            {/* icon */}
            <FaBell />
            <img
              onClick={() => setShowProfileOptions((prevState) => !prevState)}
              className={`${styles.profile__pic}`}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt=""
            />
            {showProfileOptions && (
              <div className={`${styles.profile__options}`}>
                <span className={`${styles.option}`}>
                  <SlLogout />
                  <p
                    onMouseLeave={() => setShowProfileOptions(false)}
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </span>
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
