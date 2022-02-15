const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});
io.on("connection", (socket) => {
    console.log("1");
    socket.on("join-room", (roomId, userId) => {
        console.log("2");
        socket.join(roomId);
        console.log("3");
        socket.to(roomId).emit("user-connected", userId);
        console.log(userId);
        console.log(roomId);
        socket.on("disconnect", () => {
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});
server.listen(3400);