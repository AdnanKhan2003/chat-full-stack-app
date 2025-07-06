import { FaRegEye } from "react-icons/fa";

import styles from "./Signup.module.css";
import { useState } from "react";
import { compareString, isEmail, isEmpty } from "../../lib/utils";
import Input from "../../ui/Input/Input";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../store/thunks/authThunk.js';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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
    
    const req = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formInputData),
      credentials: "include"
    });

    console.log(req);
    
    const res = await req.json();
    
    if(req.ok) {
      dispatch(checkAuth())
      navigate('/')
    } else {
      console.log(res);
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
          <p onClick={() => navigate('/signup')} className={`${styles.form__signup}`}>Sign Up</p>
          <p onClick={() => navigate('/login')} className={`${styles.form__login}`}>Login</p>
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
        <button className={`${styles.btn__signup}`} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
