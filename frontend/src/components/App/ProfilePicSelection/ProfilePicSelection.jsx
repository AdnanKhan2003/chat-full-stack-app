import { forwardRef, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { useFetch } from "../../../hooks/useFetch";
import { useState } from "react";

import Spinner from "../../../ui/Spinner/Spinner";

import styles from "./ProfilePicSelection.module.css";
import { showToast } from "../../../lib/toast";
import { handleUpdateProfilePic } from "../../../store/slices/authSlice";

const ProfilePicSelection = forwardRef(({ loggedUser, onChange }, ref) => {
  const dispatch = useDispatch();
  const inputFileRef = useRef();
  const { fetchData } = useFetch();
  const { user } = useSelector((state) => state.isAuth);
  const [preview, setPreview] = useState({
    pic: loggedUser.profilePic,
    isLoading: false,
  });

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;
      console.log(base64String);

      setPreview((prevState) => ({ ...prevState, isLoading: true }));
      const res = await fetchData(
        "http://localhost:3000/api/auth/updateProfilePic",
        {
          method: "POST",
          body: JSON.stringify({
            userId: user._id,
            profilePic: base64String,
          }),
        }
      );

      if (res) {
        setPreview((prevState) => ({ pic: res.profilePic, isLoading: false }));
        dispatch(handleUpdateProfilePic(res.profilePic));
        showToast({
          type: "success",
          title: "Profile Pic Updated!",
          message: "Sucessfully Updated Profile Pic!",
          duration: 3000,
          show: true,
          position: "top",
        });
        console.log(res);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className={`${styles.avatar__container}`}>
      {preview.isLoading && <Spinner />}
      {console.log("preview.pic", preview.pic)}
      <img
        src={preview.pic}
        className={`${styles.single__chat__profile__pic}`}
        alt=""
      />
      <div
        onClick={() => ref.current.click()}
        className={`${styles.edit__profile__pic__icon}`}
      >
        <MdEdit />
      </div>
      <input
        type="file"
        name="profile__pic"
        accept="image/*"
        ref={ref || inputFileRef}
        className={`${styles.hidden}`}
        onChange={handleChange}
      />
    </div>
  );
});

export default ProfilePicSelection;
