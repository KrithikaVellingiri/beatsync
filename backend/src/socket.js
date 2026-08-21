const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const prisma = require("./lib/prisma");

function sendSelectionError(socket, callback, message) {
  const response = { success: false, message };

  if (typeof callback === "function") {
    callback(response);
  }

  socket.emit("distributor:select:error", response);
}

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
    socket.context = null;

    if (socket.user.role === "owner" && socket.user.distributorId) {
      socket.context = {
        distributorId: socket.user.distributorId,
      };
      socket.join(`distributor:${socket.user.distributorId}`);
    }

    console.log(
      `Socket connected: ${socket.id}`
    );

    socket.on("distributor:select", async (payload, callback) => {
      if (socket.user.role !== "delivery_boy") {
        return sendSelectionError(
          socket,
          callback,
          "Only delivery boys can select a distributor context"
        );
      }

      const distributorId = Number(payload?.distributorId);

      if (!Number.isInteger(distributorId)) {
        return sendSelectionError(
          socket,
          callback,
          "A valid distributorId is required"
        );
      }

      try {
        const membership = await prisma.distributorMember.findUnique({
          where: {
            userId_distributorId: {
              userId: socket.user.userId,
              distributorId,
            },
          },
          select: { status: true },
        });

        if (!membership || membership.status !== "active") {
          return sendSelectionError(
            socket,
            callback,
            "You are not an active member of this distributor"
          );
        }

        const previousDistributorId = socket.context?.distributorId;

        if (previousDistributorId && previousDistributorId !== distributorId) {
          socket.leave(`distributor:${previousDistributorId}`);
        }

        socket.join(`distributor:${distributorId}`);
        socket.context = { distributorId };

        if (typeof callback === "function") {
          callback({
            success: true,
            activeDistributorId: distributorId,
          });
        }

        socket.emit("distributor:selected", {
          success: true,
          activeDistributorId: distributorId,
        });
      } catch (error) {
        console.error("Distributor socket context selection failed", error);
        sendSelectionError(
          socket,
          callback,
          "Unable to select distributor context"
        );
      }
    });

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