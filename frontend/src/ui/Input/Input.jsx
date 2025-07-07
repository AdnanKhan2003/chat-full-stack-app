import { FaRegEye } from "react-icons/fa";

import styles from "./Input.module.css";

const Input = ({ label, errors, onChange, ...props }) => {
  if (props.type === "password") {
    return (
      <div className={`${styles.input__unit}`}>
        <label>{label}</label>
        <div className={`${styles.password__container}`}>
          <input
            className={`${styles.password} ${styles.input}`}
            name={props.name}
            type={!props.isPasswordVisible[props.name] ? "password" : "text"}
            value={props.value}
            // onChange={(e) => handleChange("password", e)}
            onChange={(e) => onChange(props.name, e)}
          />

          <FaRegEye
            onClick={(e) =>
              // setIsPasswordVisible((prevState) => ({
              props.onClick((prevState) => ({
                ...prevState,
                [props.name]: !prevState[props.name],
              }))
            }
          />
        </div>
        {errors[props.name] && (
          <p className={`${styles.error__message}`}>{errors[props.name]}</p>
        )}
      </div>
    );
  }

  if (props.type === "file") {
    
    return (
      <div className={`${styles.input__unit}`}>
        <label>{label}</label>
        <input
          className={`${styles.profile__pic} ${styles.input}`}
          name={props.name}
          accept={props.accept}
          type={props.type}
          // onChange={(e) => handleChange("profilePic", e)}
          onChange={(e) => onChange(props.name, e)}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.input__unit}`}>
      <label>{label}</label>
      <input
        className={`${styles.input}`}
        {...props}
        onChange={(e) => onChange(props.name, e)}
      />
      {errors[props.name] && (
        <p className={`${styles.error__message}`}>{errors[props.name]}</p>
      )}
    </div>
  );
};

export default Input;
