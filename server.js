require('./globals.js')
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const uniqid = require('uniqid')
const formatMessage = require('./models/message')
const { createRoom, removeRoom, findRoom, availableRoom } = require('./models/room')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { userJoin, userLeave, createUser } = require('./models/user.js');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const Bot = "Welcome Bot ";
let resolveAfterNoSeconds = (x) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, x);
    });
}
io.on('connection', socket => {
    let bg_colour = Math.floor(Math.random() * 16777215).toString(16);
    bg_colour = "#" + ("000000" + bg_colour).slice(-6);
    const id = uniqid();
    let room = createRoom(id);
    const roomAvailable = availableRoom();
    if (room.id === roomAvailable.id || undefined == roomAvailable) {
        socket.join(room.id);
        resolveAfterNoSeconds(500).then(() => {
            io.to(room.id).emit('message', formatMessage(Bot, "Looking for someone to connect..."));
        })
    } else {
        socket.leave(room.id);
        room = roomAvailable;
        socket.join(room.id);
    }
    const user = createUser(id);
    userJoin(user, room);
    io.to(socket.id).emit('message', formatMessage(Bot, `Welcome to UChat, your name is ${user.username}`));

    // console.log("rooms capacity is " + room.capacity)
    socket.broadcast.to(room.id).emit('message', formatMessage(Bot, `${user.username} has joined the chat!`));

    if (room.capacity == 2) {
        io.to(room.id).emit('message', formatMessage(Bot, "You can start chatting now..."));
    }
    io.emit('onlineUsers', onlineUsers.length);

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.to(room.id).emit('message', formatMessage(user.username, msg, bg_colour));
    });
    // Runs when client disconnects
    socket.on('disconnect', () => {
        user.room.capacity--;
        userLeave(user.id)
        if (user.room.capacity == 0) {
            // console.log("user capacity is 0 after disconnecting")
            socket.leave(user.room.id);
            removeRoom(user.room.id)
        }
        io.to(room.id).emit('message', formatMessage(user.username, ` ${user.username} has left the chat`, bg_colour));
        // console.log("looking for someone")

        io.to(room.id).emit('message', formatMessage(Bot, "Looking for someone to connect..."));
        io.emit('onlineUsers', onlineUsers.length);
        resolveAfterNoSeconds(1000).then(() => {
            io.to(room.id).emit('reload');
        })
    })
})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

