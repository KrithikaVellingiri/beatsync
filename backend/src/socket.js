const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error("Authentication required")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;

      next();
    } catch (err) {
      next(
        new Error("Invalid authentication token")
      );
    }
  });

  io.on("connection", (socket) => {
    const distributorId =
      socket.user.distributorId;

    if (!distributorId) {
      return;
    }

    socket.join(
      `distributor:${distributorId}`
    );

    console.log(
      `Socket connected: ${socket.id}`
    );

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id}`
      );
    });
  });

  return io;
}

module.exports = {
  initializeSocket,
};