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
const { userJoin, getCurrentUser, userLeave,createUser } = require('./models/user.js');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const Bot = "Welcome Bot "
io.on('connection', socket => {
    // availableRooms.forEach(element => {
    //     console.log(element.id)
    // });
    const id = uniqid();
    let room = createRoom(id);
    
    const roomAvailable = availableRoom();
    if (undefined === roomAvailable) {
        io.to(room.id).emit('message', formatMessage(Bot, "Looking for someone to connect"));
    } else {
        room = roomAvailable;
    }
    socket.join(room.id);
    const user = createUser(id);
    userJoin(user,room);
    io.to(room.id).emit('message', formatMessage(Bot, `${user.username} has joined the chat!`));

    // console.log("room available with capacity " + user.room.capacity)
    // console.log("Total number of users is : "+ onlineUsers.length)
    if(user.room.capacity == 2){
        io.to(room.id).emit('message', formatMessage(Bot, "You can type something..."));

    }
   
    io.emit('onlineUsers',onlineUsers.length);
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.to(room.id).emit('message', formatMessage(user.username, msg));
    });
    
    

    // Runs when client disconnects
    socket.on('disconnect', () => {
        user.room.capacity--;
        console.log("Disconnected " + user.room.id)
        console.log("Capacity " + user.room.capacity)
        userLeave(user.id)
        if(user.room.capacity == 0){
            console.log("user capacity is 0 after disconnecting")
            removeRoom(user.room.id)
        }
        io.to(room.id).emit('message', formatMessage(user.username, ` ${user.username} has left the chat! Refresh your page`));
    });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

