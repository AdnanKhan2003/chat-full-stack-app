import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

export const getMessages = async (req, res, next) => {
  const chatId = req.params.chatId;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email profilePic")
      .populate("chat");

    res.status(200).json(messages);
  } catch (err) {
    const error = new Error("Creating Chat Failed");
    error.status = 500;
    res.status(error.status).json({ message: error.message });
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ message: "Invalid Data Provided!" });
    }

    const newMessage = new Message({
      content,
      sender: req.user._id,
      chat: chatId,
    });
    let result = await newMessage
      .save()
      .populate("sender", "email name profilePic")
      .populate("chat");

    result = await User.populate(result, {
      path: "chat.users",
      select: "name email profilePic",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: result,
    });

    res.status(201).json({
      message: "Message Created Successfully!",
      result
    });
  } catch (err) {
    const error = new Error("Creating Chat Failed");
    error.status = 500;
    res.status(error.status).json({ message: error.message });
  }
};
