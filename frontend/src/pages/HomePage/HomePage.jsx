import ChatMessages from "../../components/App/ChatMessages/ChatMessages";
import Header from "../../components/App/Header/Header";
import Sidebar from "../../components/App/Sidebar/Sidebar";
import { Outlet } from "react-router";

import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className="app">
      <Header />
      <div className={`${styles.app__content}`}>
        <Sidebar />
        <ChatMessages />
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
