import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./Login.module.css";
import { useState } from "react";
import { ENDPOINT_API, isEmail, isEmpty } from "../../lib/utils";
import Input from "../../components/Input/Input.jsx";
import Spinner from "../../ui/Spinner/Spinner";
import { checkAuthThunk } from "../../store/thunks/authThunk.js";
import { showToast } from "../../lib/toast.js";
import { useFetch } from "../../hooks/useFetch.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
  });
  const { data, isLoading, error, fetchData } = useFetch();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [formInputData, setFormInputData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (id, e) => {
    setErrors((prevState) => ({ ...prevState, [id]: "" }));

    setFormInputData((prevState) => ({ ...prevState, [id]: e.target.value }));
  };

  const handleValidation = () => {
    const { email, password } = formInputData;
    const inputErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

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

    setErrors(inputErrors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = handleValidation();

    const res = await fetchData(`${ENDPOINT_API}/auth/login`, {
      method: "POST",
      body: JSON.stringify(formInputData),
    });

    if (res) {
      dispatch(checkAuthThunk());
      showToast({
        type: "success",
        title: "Login Sucessful!",
        message: "We're Glad that you're here!",
        duration: 3000,
        show: true,
        position: "top",
      });

      navigate("/");
    } else {
      showToast({
        type: "error",
        title: "Login Failed!",
        message:
          "Please Enter Valid Credentials or Signup if You Don't Already Have an Account!",
        duration: 3000,
        show: true,
        position: "top",
      });
    }
  };

  const getGuestCredentials = () => {
    setErrors((prevState) => ({
      email: "",
      password: "",
    }));
    setFormInputData((prevState) => {
      return {
        email: "guest@gmail.com",
        password: "guest1",
      };
    });
  };

  return (
    <div className={`${styles.login__form}`}>
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
            onClick={() => navigate("/signup")}
            className={`${styles.form__login}`}
          >
            Login
          </p>
        </div>
        <Input
          label="Email"
          onChange={handleChange}
          value={formInputData.email}
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
          value={formInputData.password}
          onClick={setIsPasswordVisible}
          isPasswordVisible={isPasswordVisible}
        />
        <div className={`${styles.btn__container}`}>
          <button className={`${styles.btn__login}`} type="submit">
            {isLoading ? <Spinner /> : "Login"}
          </button>
          <button
            onClick={getGuestCredentials}
            className={`${styles.btn__guest}`}
            type="button"
          >
            Get Guest Login Credentials
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
