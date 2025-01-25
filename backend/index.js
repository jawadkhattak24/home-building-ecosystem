const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth");
const Message = require("./models/Message");
const socketIO = require("socket.io");
const supplierRoutes = require("./routes/supplier");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const http = require("http");

const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: process.env.FRONTEND_URL },
  debug: true,
});
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/service");

require("./config/passport");

console.log("mongodb url :", process.env.MONGODB_URI);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60 * 1000,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
// app.use(authMiddleware);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
    console.log("User joined conversation:", conversationId);
  });

  socket.on("leave-conversation", (conversationId) => {
    socket.leave(conversationId);
    console.log("User left conversation:", conversationId);
  });

  socket.on("send-message", async (message) => {
    console.log("Received send-message event:", message);

    try {
      const newMessage = new Message({
        conversationId: message.conversationId,
        sender: message.sender,
        content: message.text,
        timestamp: new Date(),
      });

      await newMessage.save();

      io.to(message.conversationId).emit("new message", newMessage);
    } catch (error) {
      socket.emit("error", error.message);
      console.error("Error saving message:", error);
    }
  });
});

app.use(
  session({
    secret: "homebuildingecosystem2024",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/supplier", supplierRoutes);

const messageRoutes = require("./routes/conversation");
app.use("/api/conversations", cors(), messageRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
