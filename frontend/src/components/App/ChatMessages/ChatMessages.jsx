import { useDispatch, useSelector } from "react-redux";
import { BsSend } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { useState } from "react";

import Message from "./Message/Message.jsx";
import EmptyChatMessages from "./EmptyChatMessages/EmptyChatMessages.jsx";
import styles from "./ChatMessages.module.css";
import ModalPortal from "../../../ui/Modal/Modal.jsx";
import GroupChatForm from "../GroupChatForm/GroupChatForm.jsx";
import { myChatThunk } from "../../../store/thunks/myChatThunk .js";
import { handleGoToChats } from "../../../store/slices/chatSlice.js";

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");
  const dispatch = useDispatch();
  const { activeChat, myChats, goToChat } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.isAuth);
  const loggedUserId = user?._id;
  const chatPartner =
    activeChat &&
    activeChat.users &&
    activeChat?.users?.find((user) => user._id !== loggedUserId);

  const handleSendMessage = (e) => {
    e.preventDefault();

    setMessages((prevMessages) => [...prevMessages, messageInput]);

    setMessageInput("");
  };

  const handleChatDetails = () => {
    setShowModal(true);
    setSelectedChat(activeChat?._id);
  };

  const handleGroupChatCreated = () => {
    dispatch(myChatThunk());
  };

  return (
    <>
    {console.log(activeChat !== '' && myChats.find(c => c._id == activeChat._id))}
    {console.log(myChats)}
      {showModal &&
        activeChat.isGroupChat &&
        selectedChat == activeChat?._id && (
          <ModalPortal onClose={setShowModal} showModal={showModal}>
            <GroupChatForm
              onClose={setShowModal}
              edit={true}
              onSuccess={handleGroupChatCreated}
            />{" "}
          </ModalPortal>
        )}
      {showModal &&
        selectedChat == activeChat?._id &&
        !activeChat.isGroupChat && (
          <ModalPortal onClose={setShowModal} showModal={showModal}>
            <div className={`${styles.single__chat__details}`}>
              <img
                src={chatPartner.profilePic}
                className={`${styles.single__chat__profile__pic}`}
                alt=""
              />
              <h4>{chatPartner.name}</h4>
              <p>{chatPartner.email}</p>
            </div>
          </ModalPortal>
        )}
      <div className={`${styles.chat__messages__container} ${goToChat ? styles.visible : styles.not__visible}`}>
        {activeChat === "" && <EmptyChatMessages />}
        {activeChat !== undefined && activeChat !== "" && (
          <>
            <div className={`${styles.chat__message__header}`}>
              
              <IoArrowBackOutline onClick={() => dispatch(handleGoToChats())} className={`${styles.btn__back}`} />
              <h3 className="message__receiver">
                {activeChat.isGroupChat
                  ? activeChat.chatName
                  : chatPartner.name}
              </h3>
              <IoEye
                className={`${styles.chat__details}`}
                onClick={handleChatDetails}
              />
            </div>

            <div className={`${styles.chat__messages__list}`}>
              {messages.map((msg, i) => (
                <Message key={i} message={msg} />
              ))}
            </div>

            <div className={`${styles.chat__messages__footer}`}>
              <form
                onSubmit={handleSendMessage}
                className={`${styles.chat__messages__input__container}`}
              >
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  type="text"
                  name="message"
                />
                <button>
                  <BsSend />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatMessages;
