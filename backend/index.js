import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import app from "./server.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config({ path: "./.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", {
      id: socket.id,
      ...data,
    });
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
