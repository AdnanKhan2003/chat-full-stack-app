import Spinner from "../../../ui/Spinner/Spinner";
import Chat from "../Chat/Chat";
import styles from "./Sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { handleActiveChat } from "../../../store/slices/chatSlice";
import { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { myChatThunk } from "../../../store/thunks/myChatThunk ";
import { useState } from "react";
import ModalPortal from "../../../ui/Modal/Modal";
import GroupChatForm from "../GroupChatForm/GroupChatForm";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { fetchData, data, isLoading: fetchIsLoading, error } = useFetch();
  const { chats, myChats, selectedChat, isLoading } = useSelector(
    (state) => state.chats
  );
  const { user } = useSelector((state) => state.isAuth);
  const { activeChat } = useSelector((state) => state.chats);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(myChatThunk());
  }, []);

  const handleGroupChatCreated = () => {
    dispatch(myChatThunk());    
    console.log(myChats, activeChat);

  };


  const handleSelectedChat = (chat) => {
    dispatch(handleActiveChat(chat));
    console.log(myChats, activeChat);
  };

  return (
    <>
      {showModal && (
        <ModalPortal onClose={setShowModal} showModal={showModal}>
          <GroupChatForm onClose={setShowModal} onSuccess={handleGroupChatCreated} />{" "}
        </ModalPortal>
      )}
      <div className={`${styles.sidebar__container}`}>
        <div className={`${styles.chat__header}`}>
          <h3>My Chats</h3>
          <button onClick={() => setShowModal(true)}>New Group Chat +</button>
        </div>
        <div className={`${styles.chats__container}`}>
          {isLoading && <Spinner />}
          {!isLoading &&
            Array.isArray(myChats) &&
            myChats.length > 0 &&
            myChats.map((chat) => {
              return (
                <Chat
                  key={chat._id}
                  chat={chat}
                  onSelect={handleSelectedChat}
                />
              );
            })}
          {/* {!isLoading &&
          Array.isArray(chats) &&
          chats.length > 0 &&
          chats.map((chat) => {
            const loggedUserId = user?._id;
            const chatPartner = chat.users.find(
              (user) => user._id !== loggedUserId
            );
            return (
              <Chat key={chat._id} chat={chat} onSelect={handleSelectedChat} />
            );
          })} */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
