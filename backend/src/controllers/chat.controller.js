import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createChat = async (req, res, next) => {
  try {
 
const currentUserId = new mongoose.Types.ObjectId(req.user._id);
const chatPartnerId = new mongoose.Types.ObjectId(req.body.userId);

    let existingChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [currentUserId, chatPartnerId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    existingChat = await User.populate(existingChat, {
      path: "latestMessage.sender",
      select: "name email profilePic",
    });

    if (existingChat.length > 0) {
      res.status(200).json(existingChat[0]);
    } else {
      const newChat = new Chat({
        isGroupChat: false,
        chatName: "sender",
        users: [currentUserId, chatPartnerId],
      });
      const result = await newChat.save();
      const fullChat = await Chat.findById(result._id).populate(
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    }
  } catch (err) {
    console.log(err);
    
    const error = new Error("Creating Chat Failed");
    error.status = 500;
    res.status(error.status).json({ message: error.message });
  }
};

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");
    const result = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "email name profilePic",
    });
    res.status(200).json(result);
  } catch (err) {
    const error = new Error("Creating Chat Failed");
    error.status = 500;
    res.status(error.status).json({ message: error.message });
  }
};

export const createGroupChat = async (req, res, next) => {
  try {
    const chatName = req.body.name;
    const users = req.body.users;
    const adminId = req.user._id;

    if (!chatName || !users) {
      return res.status(400).json({ message: "Please fill All Fields!" });
    }

    if (users.length < 2) {
      return res.status(400).json({ message: "Please Select 2 or More User" });
    }

    users.push(req.user);

    const newGroupChat = new Chat({
      chatName,
      isGroupChat: true,
      groupAdmin: adminId,
      users,
    });

    const result = await newGroupChat.save();

    const fullGroupChat = await Chat.findOne({ _id: result._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    const error = new Error("Creating Chat Failed");
    error.status = 500;
    res.status(error.status).json({ message: error.message });
  }
};

export const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found!");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (err) {
    const error = new Error("Creating Chat Failed");
    error.status = 500;
    res.status(error.status).json({ message: error.message });
  }
};

export const addToGroup = async (req, res, next) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, { 
        $push: { users: userId },
    }, {
        new: true,
    })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(added);
    }
};

export const removeFromGroup = async (req, res, next) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, {
        new: true
    })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(!removed) {
        res.status(404);
        throw new Error('Chat Not Found!');
    } else {
        res.status(200).json(removed);
    }
};