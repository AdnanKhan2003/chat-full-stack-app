import { createPortal } from "react-dom";

const ToastPortal = ({ children }) => {
  const mountNode = document.getElementById("toast-root");
  return mountNode ? createPortal(children, mountNode) : null;
};

export default ToastPortal;
