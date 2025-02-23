const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

function getSocketInstance() {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
}

module.exports = { initializeSocket, getSocketInstance };
