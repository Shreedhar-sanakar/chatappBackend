const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { mongoose } = require("mongoose");
const authRouter = require("./routes/auth");
const messageRoutes = require("./routes/messagesRoutes");
const app = express();
dotenv.config();

//connect database, here mongodb, the database is in the mongodb atlas
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error in connecting Database", err));

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRoutes);

//connecting to socket.io
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
