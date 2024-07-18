let readyPlayersCount = 0;
function listen(io) {
  const pongNamespace = io.of("/pong");
  pongNamespace.on("connection", (socket) => {
    let room;

    console.log("a user connected", socket.id);

    socket.on("ready", () => {
      room = "room" + Math.floor(readyPlayersCount / 2);
      socket.join(room);

      console.log("Player ready", socket.id, room);
      readyPlayersCount++;
      if (readyPlayersCount % 2 === 0) {
        pongNamespace.in(room).emit("startGame", socket.id);
      }
    });

    socket.on("paddleMove", (paddleData) => {
      socket.to(room).emit("paddleMove", paddleData);
    });

    socket.on("ballMove", (ballData) => {
      socket.to(room).emit("ballMove", ballData);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = { listen };
