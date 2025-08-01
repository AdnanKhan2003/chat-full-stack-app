import { motion } from "motion/react";

import { useEffect, useRef, useState } from "react";
import styles from "./SearchBox.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import User from "../User/User";
import Spinner from "../../../ui/Spinner/Spinner";
import { chatThunk } from "../../../store/thunks/chatThunk";
import { showToast } from "../../../lib/toast";
import { ENDPOINT_API } from "../../../lib/utils";

const SearchBox = () => {
  const [userName, setUserName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState();
  const { fetchData, data, isLoading } = useFetch();

  const inputRef = useRef();
  const searchBoxEle = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchUser = async () => {
    if (!userName.trim()) {
      setHasSearched(false);
      setUserName("");
      return;
    }

    setHasSearched(true);

    const res = await fetchData(
      `${ENDPOINT_API}/auth/users?search=${userName.toLowerCase()}`
    );
  };

  const accessChat = async (user) => {
    const userId = user._id;
    dispatch(chatThunk(userId));
    showToast({
      type: "success",
      title: "Chat Sucessfully Created!",
      message: "Let's Send Hi!",
      duration: 3000,
      show: true,
      position: "top",
    });
    navigate("/");
  };

  useEffect(() => {
    const timer = setTimeout(handleSearchUser, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [userName]);

  useEffect(() => {
    inputRef.current?.focus();

    setIsVisible(true);

    const handleClickOutside = (e) => {
      if (!searchBoxEle.current.contains(e.target)) {
        navigate(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      transition={{ type: "spring", duration: 0.35 }}
      ref={searchBoxEle}
      className={`${styles.searchbox__container} ${
        isVisible ? styles.show : ""
      }`}
    >
      <div className={`${styles.searchbox__header}`}>
        <h5>Search Users</h5>
      </div>

      <form
        // onSubmit={handleSearchUser}
        className={`${styles.searchbox__input}`}
      >
        <input
          ref={inputRef}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          placeholder="Search By Name Or Email.."
          onFocus={() => setHasSearched(true)}
          // onBlur={() => setHasSearched(false)}
          type="search"
          name="search"
        />
        {/* <button>Go</button> */}
      </form>

      <div className={`${styles.search__results__container}`}>
        {isLoading && <Spinner />}

        {hasSearched &&
          Array.isArray(data) &&
          data.length > 0 &&
          !isLoading &&
          data.map((user) => (
            <User key={user._id} onSelect={accessChat} data={user} />
          ))}
        {hasSearched && data && data.length === 0 && (
          <p>No Such User Exists!</p>
        )}

        {!hasSearched && !isLoading && <p>Search User By Name Or Email</p>}
      </div>
    </motion.div>
  );
};

export default SearchBox;
