import { useDispatch, useSelector } from "react-redux";
import { BsSend } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import Message from "./Message/Message.jsx";
import EmptyChatMessages from "./EmptyChatMessages/EmptyChatMessages.jsx";
import styles from "./ChatMessages.module.css";
import ModalPortal from "../../../ui/Modal/Modal.jsx";
import GroupChatForm from "../GroupChatForm/GroupChatForm.jsx";
import { myChatThunk } from "../../../store/thunks/myChatThunk .js";
import groupChatImg from "/images/group_chat.png";
import {
  handleGoToChats,
  handlePushLatestMessage,
} from "../../../store/slices/chatSlice.js";
import ChatMessageInput from "./ChatMessageInput/ChatMessageInput.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { handleAddNotification } from "../../../store/slices/notificationSlice.js";
import { setSocket } from "../../../store/slices/socketSlice.js";

const ENDPOINT = "http://localhost:3000";
// let socket;

const ChatMessages = () => {
  const socketRef = useRef();
  const { activeChat, myChats, goToChat } = useSelector((state) => state.chats);
  const { notifications } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.isAuth);
  const { socket } = useSelector((state) => state.socket);

  const [socketConnected, setSocketConnected] = useState(false);

  const [draft, setDraft] = useState({});
  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");

  const currentChatMessages = messages[activeChat?._id] || [];

  const bottomRef = useRef();

  const dispatch = useDispatch();
  const { fetchData, data, error, isLoading } = useFetch();

  const loggedUserId = user?._id;
  const chatPartner =
    activeChat &&
    activeChat.users &&
    activeChat?.users?.find((user) => user._id !== loggedUserId);

  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    socketRef.current.emit("setup", user);
    socketRef.current.on("connected", () => setSocketConnected(true));
    // dispatch(setSocket(socketRef.current));

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (!activeChat) return;

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    const handleMessageReceived = (newMessage) => {
      if (!activeChat || activeChat._id !== newMessage.chat._id) {
        const notificationAlreadyExists = notifications.some(
          (n) => n.chat._id == newMessage.chat._id
        );

        if (!notificationAlreadyExists) {
          console.log("q", newMessage);
          dispatch(handleAddNotification(newMessage));
        }

      } else {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [newMessage.chat._id]: [
            ...(prevMessages[newMessage.chat._id] || []),
            newMessage,
          ],
        }));
        console.log(activeChat._id, newMessage.content);

        dispatch(
          handlePushLatestMessage({
            chatId: activeChat._id,
            latestMessage: newMessage,
          })
        );
      }
    };

    socketRef.current.on("message received", handleMessageReceived);

    return () => {
      socketRef.current.off("message received", handleMessageReceived);
    };
  }, [notifications, messages, activeChat._id]);

  useEffect(() => {
    const handleJoinChat = async (chatId) => {
      console.log('chatmessage wala chatId', chatId);
      
      dispatch(myChatThunk());          
    };

    socketRef.current.on('join chat', handleJoinChat);
    return () => {
      socketRef.current.off('join chat', handleJoinChat);
    };
  }, [socketRef.current, activeChat._id]);

  useEffect(() => {
    const container = bottomRef.current;

    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages[activeChat?._id]]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (draft[activeChat._id].trim() == "") {
      return;
    }

    const res = await fetchData("http://localhost:3000/api/message", {
      method: "POST",
      body: JSON.stringify({
        // chatId: activeChat.users.find(user => user._id !== loggedUserId)._id,
        chatId: activeChat._id,
        content: draft[activeChat._id],
      }),
    });

    if (res.result) {
      socketRef.current.emit("new message", res.result);
      // fetchMessages();
      console.log("send message", res.result);

      setMessages((prevMsg) => ({
        ...prevMsg,
        [activeChat._id]: [...(prevMsg[activeChat._id] || []), res.result],
      }));

      console.log("wth", res.result);
      dispatch(
        handlePushLatestMessage({
          chatId: activeChat._id,
          latestMessage: res.result,
        })
      );
    }

    setDraft((prevState) => ({ ...prevState, [activeChat._id]: "" }));
  };

  const handleDraftChange = (val) => {
    setDraft((p) => {
      return {
        ...p,
        [activeChat._id]: val,
      };
    });
  };

  const handleChatDetails = () => {
    setShowModal(true);
    setSelectedChat(activeChat?._id);
  };

  const handleGroupChatCreated = () => {
    dispatch(myChatThunk());
  };

  const fetchMessages = async () => {
    const res = await fetchData(
      `http://localhost:3000/api/message/${activeChat._id}`,
      {
        method: "GET",
      }
    );

    socketRef.current.emit("join chat", activeChat._id);

    setMessages((prevMessages) => ({
      ...prevMessages,
      [activeChat._id]: res,
    }));
  };

  return (
    <>
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
      <div
        className={`${styles.chat__messages__container} ${
          goToChat ? styles.visible : styles.not__visible
        }`}
      >
        {activeChat === "" && <EmptyChatMessages />}
        {activeChat !== undefined && activeChat !== "" && (
          <>
            <div className={`${styles.chat__message__header}`}>
              <IoArrowBackOutline
                onClick={() => dispatch(handleGoToChats())}
                className={`${styles.btn__back}`}
              />
              <h3 className="message__receiver">
                {activeChat.isGroupChat
                  ? activeChat.chatName
                  : chatPartner?.name}
              </h3>
              <IoEye
                className={`${styles.chat__details}`}
                onClick={handleChatDetails}
              />
            </div>

            <div className={`${styles.chat__messages__list} `}>
              {Array.isArray(currentChatMessages) &&
                currentChatMessages.length > 0 &&
                currentChatMessages.map((msg, i) => {
                  msg = msg || msg;
                  const isUserSender = msg.sender?._id == loggedUserId;

                  const currentMessageSender = msg.sender?._id;

                  const nextMessageSender =
                    currentChatMessages[i + 1]?.sender?._id;
                  const streakContinues =
                    currentMessageSender === nextMessageSender;
                  const showAvatar = !streakContinues;

                  return (
                    <Message
                      key={msg._id}
                      message={msg}
                      isUserSender={isUserSender}
                      showAvatar={showAvatar}
                    />
                  );
                })}
              <div ref={bottomRef}></div>
            </div>
            <div className={`${styles.chat__messages__footer}`}>
              {socketRef.current && (
                <ChatMessageInput
                  socket={socket?.current}
                  socketConnected={socketConnected}
                  activeChat={activeChat}
                  draft={draft[activeChat?._id] || ""}
                  onDraftChange={handleDraftChange}
                  onSend={handleSendMessage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatMessages;
