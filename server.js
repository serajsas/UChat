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
// const faker = require('faker');
const { userJoin, getCurrentUserInRoom, userLeave, createUser } = require('./models/user.js');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const Bot = "Welcome Bot "
io.on('connection', socket => {
    io.to(socket.id).emit('message',formatMessage(Bot, "This website is for anonymous and random chatting. By using UBChat, you confirm that you are a UBC student and you should note that we are not responsible for anything happens on this website, Enjoy!"));

    io.to(socket.id).emit('message',formatMessage(Bot, "Welcome to UBChat"));
    let resolveAfterhalfSecond = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            }, 500);
        });
    }
    let resolveAfter5Seconds = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            }, 5000);
        });
    }
    resolveAfter5Seconds();
    const id = uniqid();
    let room = createRoom(id);
    const roomAvailable = availableRoom();
    if (room.id === roomAvailable.id || undefined == roomAvailable) {
        socket.join(room.id);
        resolveAfterhalfSecond().then(() => {
            io.to(room.id).emit('message', formatMessage(Bot, "Looking for someone to connect..."));
        })
    } else {
        room = roomAvailable;
        socket.join(room.id);
    }
    const user = createUser(id);
    userJoin(user, room);
    // console.log("rooms capacity is " + room.capacity)
    socket.broadcast.to(room.id).emit('message', formatMessage(Bot, `${user.username} has joined the chat!`));

    if (room.capacity == 2) {
        io.to(room.id).emit('message', formatMessage(Bot, "You can start chatting now..."));
    }
    io.emit('onlineUsers', onlineUsers.length);

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.to(room.id).emit('message', formatMessage(user.username, msg));
    });



    // Runs when client disconnects
    socket.on('disconnect', () => {
        user.room.capacity--;
        userLeave(user.id)
        if (user.room.capacity == 0) {
            // console.log("user capacity is 0 after disconnecting")
            removeRoom(user.room.id)
        }
        io.to(room.id).emit('message', formatMessage(user.username, ` ${user.username} has left the chat`));
        // console.log("looking for someone")

        io.to(room.id).emit('message', formatMessage(Bot, "Looking for someone to connect"));
        resolveAfterhalfSecond().then(() => {
            io.emit('onlineUsers', onlineUsers.length);
            io.to(room.id).emit('reload');
        })
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    // console.log(`Listening to port ${PORT}`)
})

