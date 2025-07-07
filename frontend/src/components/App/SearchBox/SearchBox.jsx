import { useEffect, useRef, useState } from 'react';
import styles from './SearchBox.module.css';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import User from '../User/User';

const SearchBox = () => {
    const [userName, setUserName] = useState("");
    const searchBoxEle = useRef();
    const navigate = useNavigate();

    const handleSearchUser = async (e) => {
        e.preventDefault();
        
        console.log(userName);
        
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(!searchBoxEle.current.contains(e.target)) {
                navigate(-1);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

  return (
    <div ref={searchBoxEle} className={`${styles.searchbox__container}`}>
        <div className={`${styles.searchbox__header}`}>
            <h5>Search Users</h5>
        </div>

        <form onSubmit={handleSearchUser} className={`${styles.searchbox__input}`}>
            <input 
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            placeholder='Search By Name Or Email..'
            type="search" name="search" />
            <button>Go</button>
        </form>

        <div className="search__results__container">
            <User />
            {/* <div className={`${styles.results__user__container}`}>
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className={`${styles.user__profile__pic}`} />
                <div className="results__content">
                    <h5>User</h5>
                    <p>This is the best...</p>
                </div>
            </div> */}
        </div>
    </div>
  )
}

export default SearchBox