import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "User Not Authenticated!",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      res.status(403).json({
        message: "User Not Authorized!",
      });
    }

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }

    req.user = user;
    next();
  } catch (err) {
        // const error = new Error("You're Not Authenticated! Please Login");
        // error.status = 500;
        // res.status(error.status).json({
        //     message: error.message
        // });
        res.status(500).json({ message: "Internal server error" });
  }
};
