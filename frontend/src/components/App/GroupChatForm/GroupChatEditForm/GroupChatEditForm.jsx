import { useState } from "react";
import { useSelector } from "react-redux";
import { useFetch } from "../../../../hooks/useFetch";

import User from "../../User/User";
import UserBadge from "../../UserBadge/UserBadge";

import styles from "../GroupChatForm.module.css";
import { showToast } from "../../../../lib/toast";

const GroupChatEditForm = ({
  onCreate,
  onAddUser,
  onRemoveUser,
  onChangeUser,
  usersInput,
  userSearchResults,
  onSuccess,
}) => {
  const { activeChat, chats, myChats } = useSelector((state) => state.chats);
  const [chatNameInput, setChatNameInput] = useState(activeChat.chatName || "");
  const { fetchData, data, isLoading, error } = useFetch();

  
  const handleEditGroupChatName = async () => {
    console.log(chatNameInput);

    const res = await fetchData("http://localhost:3000/api/chat/rename", {
      method: "PUT",
      body: JSON.stringify({ chatId: activeChat._id, chatName: chatNameInput }),
    });

    console.log(res);
    
    if (res) {
      setChatNameInput(res.chatName);
      console.log(onSuccess);
      
      onSuccess();
    } else {
      showToast({
        type: "error",
        title: "Updating Chat Name Failed!",
        message: "Please Try Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <h4>Create Group Chat</h4>
      <div
        className={`${styles.users__container} ${styles.users__container__edit}`}
      >
        {
          console.log(activeChat, myChats)
        }
        {Array.isArray(activeChat.users) &&
          activeChat.users.length > 0 &&
          activeChat.users.map((user) => {
            console.log(user);
            
            return (
              <UserBadge key={user._id} user={user} onRemove={onRemoveUser} edit={true} />
            );
          })}
      </div>
      {
        console.log('activeChat', activeChat)
      }
      <form onSubmit={onCreate} className={`${styles.form__group}`}>
        <div className={`${styles.form__inputs}`}>
          <div className={`${styles.chatname__container}`}>
            <input
              onChange={(e) => setChatNameInput(e.target.value)}
              value={chatNameInput}
              type="text"
              name="chatName"
              placeholder="Enter Chat Name"
            />
            <button type="button" onClick={handleEditGroupChatName}>
              Update
            </button>
          </div>
          <input
            type="search"
            name="users"
            onChange={(e) => onChangeUser(e.target.value)}
            value={usersInput}
            className={`${styles.users__input}`}
            placeholder="Add Users. eg: Adnan"
          />
          <div className={`${styles.search__results__container}`}>
            {userSearchResults &&
              userSearchResults.length > 0 &&
              userSearchResults.map((user) => {
                return <User key={user._id} editUser={true} data={user} onSelect={onAddUser} />;
              })}
          </div>
          <button
            type="button"
            onClick={onCreate}
            className={`${styles.dialog__submit}`}
          >
            Create Chat
          </button>
        </div>
      </form>
    </>
  );
};

export default GroupChatEditForm;
