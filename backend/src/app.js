import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import { Server } from "socket.io";

import { connectDB } from "./lib/database.js";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

if(process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}



io.on("connection", (socket) => {
  console.log(`Client connected with Socket ID: ${socket.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id;
    socket.emit("connected");
    console.log(`Solo room by  ${userData._id}`);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`Chat room joined by: ${room}`);
    // if (!refetch) {
    //   socket.join(room);
    //   return;
    // }

    socket.in(room).emit('join chat');
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("start typing", (room) => {
    socket.in(room).emit("start typing", room);
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", room);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED " + socket.userId);
    socket.leave(socket.userId);
  });
});


server.listen(PORT, () => connectDB());
