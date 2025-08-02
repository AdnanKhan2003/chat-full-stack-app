import { useEffect, useState } from "react";
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
  handleRemoveUserFromGroup as handleRemoveUserFromGroupAction,
  triggerRefetch,
} from "../../../store/slices/chatSlice";
import { ENDPOINT, ENDPOINT_API } from "../../../lib/utils";

const GroupChatForm = ({ onClose, onSuccess, edit = false }) => {
  const [chatNameInput, setChatNameInput] = useState("");
  const [usersInput, setUsersInput] = useState("");

  const [users, setUsers] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);

  const { myChats, activeChat } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.isAuth);
  // const { socket } = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const { fetchData, data, isLoading, error } = useFetch();

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearchUsers();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [usersInput]);

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

    const res = await fetchData(`${ENDPOINT_API}/chat/group`, {
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

    setUsersInput("");

    onClose(false);
    onSuccess(res);
    dispatch(handleAddToMyChats(res));
    navigate("/");
  };

  const handleEditGroupUsers = async (user) => {
    const res = await fetchData(`${ENDPOINT_API}/chat/groupadd`, {
      method: "PUT",
      body: JSON.stringify({ chatId: activeChat._id, userId: user._id }),
    });

    if (res) {
      showToast({
        type: "success",
        title: "User Added!",
        message: "Added User Successfully!",
        duration: 3000,
        show: true,
        position: "top",
      });
      dispatch(handleAddUserToGroup(res));
    } else if (res == null) {
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
  };

  const handleRemoveUser = (id, editUser = false) => {
    if (editUser) {
      if (user._id !== activeChat.groupAdmin._id) {
        showToast({
          type: "error",
          title: "Only Admin Can Remove User!",
          message: "You can't Remove Users!",
          duration: 3000,
          show: true,
          position: "top",
        });
        return;
      }
    }

    setUsers((prevState) => {
      if (prevState.length > 0) {
        return prevState.filter((user) => user._id !== id);
      }
      return prevState;
    });

    if (editUser) {
      handleRemoveUserFromGroup(id);
    }
  };

  const handleRemoveUserFromGroup = async (id) => {
    const res = await fetchData(`${ENDPOINT_API}/chat/groupremove`, {
      method: "PUT",
      body: JSON.stringify({ chatId: activeChat._id, userId: id }),
    });

    if (res) {
      if (res.message == "You Left Group") {
        onClose();
        showToast({
          type: "success",
          title: "You Left Group!",
          message: "Group Deleted Successfully!",
          duration: 3000,
          show: true,
          position: "top",
        });
        dispatch(triggerRefetch(true));
      } else {
        showToast({
          type: "success",
          title: "User Removed!",
          message: "Removed User Successfully!",
          duration: 3000,
          show: true,
          position: "top",
        });
        dispatch(handleRemoveUserFromGroupAction(res));
      }
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

  const handleSearchUsers = async () => {
    const value = usersInput.toLowerCase();

    if (!value.trim()) {
      setUserSearchResults([]);
      setUsersInput("");
      return;
    }

    const res = await fetchData(`${ENDPOINT_API}/auth/users?search=${value}`, {
      method: "GET",
    });

    setUserSearchResults(res);
  };

  if (edit) {
    return (
      <GroupChatEditForm
        onCreate={handleCreateGroup}
        onAddUser={handleAddUsers}
        onRemoveUser={handleRemoveUser}
        onChangeUser={handleSearchUsers}
        usersInput={usersInput}
        setUsersInput={setUsersInput}
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
            onChange={(e) => setUsersInput(e.target.value)}
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
          <div className={`${styles.search__results__container}`}>
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
