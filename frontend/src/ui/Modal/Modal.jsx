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
      if(e.target == dialogEl){       
        dialogEl.close();
        onClose(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showModal, onClose]);


  return (
    <dialog
      ref={dialog}
      className={`${styles.dialog}`}
    >
      <IoMdClose
        onClick={() => onClose(false)}
        className={`${styles.btn__close}`}
      />
      {children}
    </dialog>
  );
};

const ModalPortal = ({ onClose, showModal, children }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return;

  return createPortal(
    <Modal onClose={onClose} showModal={showModal}>{children}</Modal>,
    modalRoot
  );
};

export default ModalPortal;
