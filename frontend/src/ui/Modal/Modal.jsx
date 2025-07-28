import { motion } from "motion/react";

import { createPortal } from "react-dom";
import { useRef } from "react";
import { useEffect } from "react";

import { IoMdClose } from "react-icons/io";

import styles from "./Modal.module.css";

const Modal = ({ onClose, showModal, children }) => {
  const dialog = useRef();

  useEffect(() => {
    const dialogEl = dialog.current;
    showModal && dialogEl.showModal();

    const handleClickOutside = (e) => {
      if (e.target == dialogEl) {
        dialogEl.close();
        onClose(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showModal, onClose]);

  return (
    <motion.dialog
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transform: "translate(-50%, -50%)" }}
      transition={{
        duration: 0.32,
        type: "spring",
      }}
      exit={{ opacity: 0, duration: 0.5 }}
      ref={dialog}
      className={`${styles.dialog}`}
    >
      <IoMdClose
        onClick={() => onClose(false)}
        className={`${styles.btn__close}`}
      />
      {children}
    </motion.dialog>
  );
};

const ModalPortal = ({ onClose, showModal, children }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return;

  return createPortal(
    <Modal onClose={onClose} showModal={showModal}>
      {children}
    </Modal>,
    modalRoot
  );
};

export default ModalPortal;
