import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search;
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id },
    });
    res.status(200).json(users);
  } catch (err) {
    const error = new Error("User Signup Failed!");
    error.status = err.status || 500;
    next(error);
  }
};

export const postSignup = async (req, res, next) => {
  const { name, email, password, profilePic } = req.body;

  try {
    let uploadProfileUrl = "";

    if (profilePic && profilePic.trim() !== "") {
      const uploadResult = await cloudinary.uploader.upload(profilePic, {
        folder: "profile__pics",
      });

      uploadProfileUrl = uploadResult.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: uploadProfileUrl || undefined,
    });

    const result = await newUser.save();

    generateToken(newUser._id, res);

    res.status(200).json({
      message: "User Signup Completed!",
      _id: result._id,
      name: result.name,
      email: result.email,
      profilePic: result.profilePic,
    });
  } catch (err) {
    const error = new Error(err.message + "User Signup Failed!");
    error.status = err.status || 500;
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Invalid Credentials");
      error.status = 400;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "User Login Successful!",
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    const error = new Error("User Login Failed!");
    error.status = err.status || 500;
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "User Logout Successful!",
    });
  } catch (err) {
    const error = new Error("User Logout Failed!");
    error.status = err.status || 500;
    next(error);
  }
};

export const checkAuth = (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    // const error = new Error("Interval Server Error");
    // error.status = 500;
    // res.status(error.status).json({
    //   message: error.message,
    // });
    res.status(500).json({
      message: "You're not Authenticated",
    });
  }
};

export const updateUserProfilePic = async (req, res, next) => {
  try {
    const { userId, profilePic } = req.body;

    if(!profilePic) {
      return res.status(400).json({ message: 'No Profile Pic Provided!' });
    }

    let updatedProfilePic = '';

    const result = await cloudinary.uploader.upload(profilePic, { folder: 'profile__pics' });

    updatedProfilePic = result.secure_url;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: updatedProfilePic
    }, {new: true});

    if(!updatedUser) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.status(200).json({ profilePic: updatedUser.profilePic });
  } catch (err) {
    res.status(500).json({
      message: err.message + "You're not Authenticated",
    });
  }
};
