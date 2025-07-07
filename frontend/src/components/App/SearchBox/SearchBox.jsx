import { useEffect, useRef, useState } from "react";
import styles from "./SearchBox.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../../hooks/useFetch";
import User from "../User/User";
import Spinner from "../../../ui/Spinner/Spinner";

const SearchBox = () => {
  const [userName, setUserName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState();
  const { fetchData, data, isLoading, error } = useFetch();
  const inputRef = useRef();
  const searchBoxEle = useRef();
  const navigate = useNavigate();

  const handleSearchUser = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    const res = await fetchData(
      `http://localhost:3000/api/auth/users?search=${userName}`
    );
  };

  const accessChat = async (userId) => { 
    console.log(userId);
    
    // const res = await fetchData('http://localhost:3000/api/chat', {
    //     method: 'POST',
    //     body: JSON.stingify(userId)
    // })

    // console.log(res);
    
  };

  useEffect(() => {
    inputRef.current?.focus();

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const handleClickOutside = (e) => {
      if (!searchBoxEle.current.contains(e.target)) {
        navigate(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchBoxEle}
      className={`${styles.searchbox__container} ${
        isVisible ? styles.show : ""
      }`}
    >
      <div className={`${styles.searchbox__header}`}>
        <h5>Search Users</h5>
      </div>

      <form
        onSubmit={handleSearchUser}
        className={`${styles.searchbox__input}`}
      >
        <input
          ref={inputRef}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          placeholder="Search By Name Or Email.."
          type="search"
          name="search"
        />
        <button>Go</button>
      </form>

      <div className="search__results__container">
        {isLoading && <Spinner />}
        {hasSearched &&
          Array.isArray(data) &&
          data.length > 0 &&
          !isLoading &&
          data.map((user) => <User key={user._id} onSelect={accessChat} data={user} />)}
        {hasSearched && data && data.length === 0 && (
          <p>No Such User Exists!</p>
        )}
        {!hasSearched && !isLoading && <p>Search User By Name Or Email</p>}
      </div>
    </div>
  );
};

export default SearchBox;
