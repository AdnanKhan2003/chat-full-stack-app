import Spinner from "../../../ui/Spinner/Spinner";
import Chat from "../Chat/Chat";
import styles from "./Sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  handleActiveChat,
  handleGoToChat,
} from "../../../store/slices/chatSlice";
import { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { myChatThunk } from "../../../store/thunks/myChatThunk ";
import { useState } from "react";
import ModalPortal from "../../../ui/Modal/Modal";
import GroupChatForm from "../GroupChatForm/GroupChatForm";
import { AnimatePresence } from "motion/react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { fetchData, data, isLoading: fetchIsLoading, error } = useFetch();
  const { myChats, goToChat, refetchFlag, isLoading } = useSelector(
    (state) => state.chats
  );
  const w = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.isAuth);
  const { activeChat } = useSelector((state) => state.chats);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(myChatThunk());
  }, [refetchFlag]);

  useEffect(() => {
    if (activeChat || myChats.length == 0) return;

    let localActiveChatId = null;
    try {
      localActiveChatId =
        JSON.parse(localStorage.getItem("persistentActiveChatId")) || null;
    } catch (err) {
      console.log("Can Not Read Active Chat Id");
      return;
    }

    if (!localActiveChatId) return;

    const matchChat = myChats.find((chat) => chat._id == localActiveChatId);
    if (matchChat) {
      dispatch(handleActiveChat(matchChat));
    }
  }, [myChats, activeChat]);

  useEffect(() => {
    if (activeChat?._id) {
      localStorage.setItem(
        "persistentActiveChatId",
        JSON.stringify(activeChat._id)
      );
    }
  }, [activeChat]);

  const handleGroupChatCreated = (chat) => {
    dispatch(myChatThunk());
    dispatch(handleActiveChat(chat));
  };

  const handleSelectedChat = (chat) => {
    dispatch(handleActiveChat(chat));
    dispatch(handleGoToChat());
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <ModalPortal onClose={setShowModal} showModal={showModal}>
            <GroupChatForm
              onClose={setShowModal}
              onSuccess={handleGroupChatCreated}
            />{" "}
          </ModalPortal>
        )}
      </AnimatePresence>

      <div
        className={`${styles.sidebar__container} ${
          goToChat ? styles.not__visible : styles.visible
        }`}
      >
        <div className={`${styles.chat__header}`}>
          <h3>My Chats</h3>
          <button onClick={() => setShowModal(true)}>New Group Chat +</button>
        </div>
        <div className={`${styles.chats__container}`}>
          {isLoading && <Spinner />}
          {!isLoading &&
            Array.isArray(myChats) &&
            myChats.length > 0 &&
            [...myChats]
              .sort((a, b) => {
                const aTime = new Date(
                  a.latestMessage?.createdAt || a.updatedAt || 0
                ).getTime();
                const bTime = new Date(
                  b.latestMessage?.createdAt || b.updatedAt || 0
                ).getTime();
                return bTime - aTime;
              })
              .map((chat) => {
                return (
                  <Chat
                    key={chat._id}
                    chat={chat}
                    onSelect={handleSelectedChat}
                  />
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
