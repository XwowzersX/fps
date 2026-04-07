const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
    console.log("player joined:", socket.id);

    players[socket.id] = {
        x: 0,
        y: 1,
        z: 0
    };

    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("move", (data) => {
        players[socket.id] = data;
        io.emit("updatePlayers", players);
    });

    socket.on("disconnect", () => {
        console.log("player left:", socket.id);
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

http.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
