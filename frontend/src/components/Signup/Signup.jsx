import { FaRegEye } from "react-icons/fa";

import styles from "./Signup.module.css";
import { useState } from "react";
import { compareString, ENDPOINT_API, isEmail, isEmpty } from "../../lib/utils";
import Input from "../../components/Input/Input.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuthThunk } from "../../store/thunks/authThunk.js";
import Toast from "../../ui/Toast/Toast.jsx";
import { showToast } from "../../lib/toast.js";
import { useFetch } from "../../hooks/useFetch";
import Spinner from "../../ui/Spinner/Spinner";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchData, data, isLoading, error } = useFetch();

  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [formInputData, setFormInputData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const handleChange = (id, e) => {
    setErrors((prevState) => ({ ...prevState, [id]: "" }));

    if (id !== "profilePic") {
      setFormInputData((prevState) => ({ ...prevState, [id]: e.target.value }));
    } else {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setFormInputData((prevState) => {
          return {
            ...prevState,
            [id]: base64String,
          };
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleValidation = () => {
    const { name, email, password, confirmPassword, profilePic } =
      formInputData;
    const inputErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePic: "",
    };

    let isValid = true;

    if (isEmpty(name)) {
      inputErrors.name = "Name is Required*";
      isValid = false;
    }

    if (isEmpty(email)) {
      inputErrors.email = "Email is Required*";
      isValid = false;
    } else if (!isEmail(email)) {
      inputErrors.email = "Email Format is Invalid!";
      isValid = false;
    }

    if (isEmpty(password)) {
      inputErrors.password = "Password is Required!";
      isValid = false;
    }

    if (isEmpty(confirmPassword)) {
      inputErrors.confirmPassword = "Confirm Password is Required!";
      isValid = false;
    } else if (!compareString(password, confirmPassword)) {
      inputErrors.confirmPassword = "Passwords Do Not Match!";
      isValid = false;
    }

    setErrors(inputErrors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = handleValidation();
    console.log(isValid);
    console.log(formInputData);

    if (!isValid) {
      showToast({
        type: "error",
        title: "Invalid Credentials!",
        message: "Please Enter Valid Data!",
        duration: 3000,
        show: true,
        position: "top",
      });
      return;
    }

    const res = await fetchData(`${ENDPOINT_API}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(formInputData),
    });

    if (res) {
      dispatch(checkAuthThunk());
      showToast({
        type: "success",
        title: "Signup Sucessful!",
        message: "Welcome, We're Glad to have you here!",
        duration: 3000,
        show: true,
        position: "top",
      });
      navigate("/");
    } else {
      showToast({
        type: "error",
        title: "Signup Failed!",
        message: "Please Enter Valid Data!",
        duration: 3000,
        show: true,
        position: "top",
      });
    }
  };

  return (
    <div className={`${styles.signup__container}`}>
      <div className={`${styles.signup__header}`}>
        <h1>TalkAbit</h1>
      </div>
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className={`${styles.signup__form}`}
      >
        <div className={`${styles.auth__options}`}>
          <p
            onClick={() => navigate("/signup")}
            className={`${styles.form__signup}`}
          >
            Sign Up
          </p>
          <p
            onClick={() => navigate("/login")}
            className={`${styles.form__login}`}
          >
            Login
          </p>
        </div>
        <Input
          label="Name"
          onChange={handleChange}
          errors={errors}
          type="text"
          name="name"
        />
        <Input
          label="Email"
          onChange={handleChange}
          errors={errors}
          type="email"
          name="email"
        />
        <Input
          label="Password"
          errors={errors}
          type="password"
          name="password"
          onChange={handleChange}
          onClick={setIsPasswordVisible}
          isPasswordVisible={isPasswordVisible}
        />
        <Input
          label="Confirm Password"
          errors={errors}
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          onClick={setIsPasswordVisible}
          isPasswordVisible={isPasswordVisible}
        />

        <Input
          label="Profile Picture"
          name="profilePic"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        {formInputData.profilePic && (
          <div className={`${styles.preview__container}`}>
            <img
              src={formInputData.profilePic}
              className={`${styles.preview__image}`}
              alt="Preview"
            />
            <button onClick={() => setFormInputData(prevState => ({ ...prevState, profilePic: "" }))} className={`${styles.btn__preview}`}>X</button>
          </div>
        )}
        <div className={`${styles.btn__container}`}>
          <button className={`${styles.btn__signup}`} type="submit">
            {isLoading ? <Spinner /> : "Sign Up"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className={`${styles.btn__guest}`}
            type="button"
          >
            Get Guest Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
