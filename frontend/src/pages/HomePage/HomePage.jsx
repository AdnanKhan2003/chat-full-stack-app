import { useDispatch, useSelector } from 'react-redux'

import ChatMessages from "../../components/App/ChatMessages/ChatMessages";
import Header from "../../components/App/Header/Header";
import Sidebar from "../../components/App/Sidebar/Sidebar";
import SignupPage from '../SignupPage/SignupPage';
import { Outlet } from 'react-router';

import styles from './HomePage.module.css';

const HomePage = () => {
  // const isAuth= useSelector(state => state.isAuth.user);

  // if(!isAuth) return <SignupPage />

  return (
    <div className="app">
      <Header />
      <div className={`${styles.app__content}`}>
        <Sidebar />
        <ChatMessages />
        <Outlet />
      </div>
      {/* <Signup /> */}
      {/* <Login /> */}
    </div>
  );
};

export default HomePage;
