import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";

import User from "../User/User";
import UserBadge from "../UserBadge/UserBadge";

import styles from "./GroupChatForm.module.css";
import { useNavigate } from "react-router";
import { showToast } from "../../../lib/toast";
import GroupChatEditForm from "./GroupChatEditForm/GroupChatEditForm";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAddToMyChats,
  handleAddUserToGroup,
  handlePushNotificationChat,
  handleRemoveUserFromGroup as handleRemoveUserFromGroupAction,
} from "../../../store/slices/chatSlice";
// import { setSocket } from "../../../store/slices/socketSlice";

const GroupChatForm = ({ onClose, onSuccess, edit = false }) => {
  const [ chatNameInput, setChatNameInput ] = useState("");
  const [ usersInput, setUsersInput ] = useState("");

  const [ users, setUsers ] = useState([]);
  const [ userSearchResults, setUserSearchResults ] = useState([]);

  const { myChats, activeChat } = useSelector((state) => state.chats);
  // const { socket } = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const { fetchData, data, isLoading, error } = useFetch();

  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    const chatName = chatNameInput.trim();

    if (!chatName && users.length === 0) {
      showToast({
        type: "error",
        title: "Data is Missing!",
        message: "Please Enter Data In All Fields!",
        duration: 3000,
        show: true,
        position: "top",
      });
      return;
    }

    console.log(chatName, users);

    const res = await fetchData("http://localhost:3000/api/chat/group", {
      method: "POST",
      body: JSON.stringify({ name: chatName, users }),
    });

    if (!res) {
      showToast({
        type: "error",
        title: "Creating Group Failed!",
        message: "Please Enter Valid Data And Try Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
      return;
    }

    console.log('gcf', res);
    
    setUsersInput("");

    onClose(false);
    onSuccess(res);
    dispatch(handleAddToMyChats(res));
    // dispatch(handlePushNotificationChat(res._id));
    navigate("/");
  };

  const handleEditGroupUsers = async (user) => {
    console.log(user, activeChat);

    const res = await fetchData("http://localhost:3000/api/chat/groupadd", {
      method: "PUT",
      body: JSON.stringify({ chatId: activeChat._id, userId: user._id }),
    });
    console.log('ADDkia', res);


    if (res) {
      console.log("add user", res);
      showToast({
        type: "success",
        title: "User Added!",
        message: "Added User Successfully!",
        duration: 3000,
        show: true,
        position: "top",
      });
      dispatch(handleAddUserToGroup(res));
    } else if(res == null){
      console.log(res);
      
      showToast({
        type: "error",
        title: "Only Admin Can Add Users!",
        message: "You can't Add Users!",
        duration: 3000,
        show: true,
        position: "top",
      });
    } else {
      showToast({
        type: "error",
        title: "User Already Exists!",
        message: "Can't Add Existing User Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
    }
  };

  const handleAddUsers = (userToAdd, editUser = false) => {
    console.log("editUser");

    console.log(editUser);

    if (editUser) {
      handleEditGroupUsers(userToAdd);
      return;
    }

    setUsers((prevState) => {
      const userExists = prevState.some((user) => user._id == userToAdd._id);
      if (userExists) {
        showToast({
          type: "error",
          title: "User Already Exists!",
          message: "Can't Add Existing User Again!",
          duration: 3000,
          show: true,
          position: "top",
        });
        return prevState;
      }
      return [...prevState, userToAdd];
    });
    setUsersInput("");
    setUserSearchResults([]);
    console.log(users);
  };

  const handleRemoveUser = (id, editUser = false) => {
    console.log(id);

    setUsers((prevState) => {
      if (prevState.length > 0) {
        return prevState.filter((user) => user._id !== id);
      }
      return prevState;
    });

    if ((editUser = true)) {
      handleRemoveUserFromGroup(id);
    }
  };

  const handleRemoveUserFromGroup = async (id) => {
    console.log("w");

    const res = await fetchData("http://localhost:3000/api/chat/groupremove", {
      method: "PUT",
      body: JSON.stringify({ chatId: activeChat._id, userId: id }),
    });
    console.log("w", res);

    if (res) {
      console.log("remove user", res);
      showToast({
        type: "success",
        title: "User Removed!",
        message: "Removed User Successfully!",
        duration: 3000,
        show: true,
        position: "top",
      });
      dispatch(handleRemoveUserFromGroupAction(res));
      console.log(res);
    } else if (res == null) {
      showToast({
        type: "error",
        title: "Only Admin Can Remove User!",
        message: "You can't Remove Users!",
        duration: 3000,
        show: true,
        position: "top",
      });
    } else {
      showToast({
        type: "error",
        title: "Couldn't Remove User!",
        message: "Removing User Again!",
        duration: 3000,
        show: true,
        position: "top",
      });
    }
  };

  const handleChangeUsers = (value) => {
    handleSearchUsers(value);
    console.log("value", value);
    console.log("users", users);
  };

  const handleSearchUsers = async (value) => {
    value = value.toLowerCase();
    const res = await fetchData(
      `http://localhost:3000/api/auth/users?search=${value}`,
      {
        method: "GET",
      }
    );

    setUsersInput((prevState) => value);

    setUserSearchResults(res);
  };

  if (edit) {
    return (
      <GroupChatEditForm
        onCreate={handleCreateGroup}
        onAddUser={handleAddUsers}
        onRemoveUser={handleRemoveUser}
        onChangeUser={handleChangeUsers}
        usersInput={usersInput}
        userSearchResults={userSearchResults}
        onSuccess={onSuccess}
        chatUsers={users}
      />
    );
  }

  return (
    <>
      <h4>Create Group Chat</h4>

      <form onSubmit={handleCreateGroup} className={`${styles.form__group}`}>
        <div className={`${styles.form__inputs}`}>
          <div className={`${styles.chatname__container}`}>
            <input
              onChange={(e) => setChatNameInput(e.target.value)}
              value={chatNameInput}
              type="text"
              name="chatName"
              placeholder="Enter Chat Name"
            />
          </div>
          <input
            type="search"
            name="users"
            onChange={(e) => handleChangeUsers(e.target.value)}
            value={usersInput}
            className={`${styles.users__input}`}
            placeholder="Add Users. eg: Adnan"
          />
          <div className={`${styles.users__container}`}>
            {Array.isArray(users) &&
              users.length > 0 &&
              users.map((user) => {
                return (
                  <UserBadge
                    key={user._id}
                    user={user}
                    onRemove={handleRemoveUser}
                  />
                );
              })}
          </div>
          <div className="search__results__container">
            {userSearchResults &&
              userSearchResults.length > 0 &&
              userSearchResults.map((user) => {
                return (
                  <User key={user._id} data={user} onSelect={handleAddUsers} />
                );
              })}
          </div>
          <button
            type="button"
            onClick={handleCreateGroup}
            className={`${styles.dialog__submit}`}
          >
            Create Chat
          </button>
        </div>
      </form>
    </>
  );
};

export default GroupChatForm;
