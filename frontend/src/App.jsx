import { createBrowserRouter, Navigate } from "react-router";
import "./App.css";
import ChatMessages from "./components/App/ChatMessages/ChatMessages";
import Header from "./components/App/Header/Header";
import Sidebar from "./components/App/Sidebar/Sidebar";
import HomePage from "./pages/HomePage/HomePage";
import { RouterProvider } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { checkAuthThunk } from "./store/thunks/authThunk";
import SignupPage from "./pages/SignupPage/SignupPage";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage/LoginPage";
import SearchBox from "./components/App/SearchBox/SearchBox";
import {
  hideToast,
  showToast,
  initialToastState,
  toastReducer,
  registerDispatch,
} from "./lib/toast";
import Toast from "./ui/Toast/Toast";
import Spinner from "./ui/Spinner/Spinner";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isAuth);
  const isAuth = useSelector((state) => state.isAuth.user);
  const [toastState, toastDispatch] = useReducer(
    toastReducer,
    initialToastState
  );

  registerDispatch(toastDispatch);

  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast();
    }, toastState.duration);
    return () => {
      clearTimeout(timer);
    };
  }, [toastState.show]);

  if (isLoading) {
    return <Spinner />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuth ? <HomePage /> : <LoginPage />,
      children: [
        {
          path: "/search",
          element: <SearchBox />,
        },
      ],
    },
    {
      path: "/signup",
      element: !isAuth ? <SignupPage /> : <Navigate to="/" />,
    },
    {
      path: "/login",
      element: !isAuth ? <LoginPage /> : <Navigate to="/" />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {toastState.show && (
        <Toast
          type={toastState.type}
          title={toastState.title}
          message={toastState.message}
          duration={toastState.duration}
          show={toastState.show}
          position={toastState.position}
          onClose={hideToast}
        />
      )}
    </>
  );
}

export default App;
