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
const faker = require('faker');
const { userJoin, getCurrentUser, userLeave } = require('./models/user.js');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const Bot = "Welcome Bot "
io.on('connection', socket => {
    const username = faker.address.cityName();
    const id = uniqid();
    let room = createRoom(id);
    const roomAvailable = availableRoom();
    if (undefined === roomAvailable) {
        socket.join(room.id);
    } else {
        if(availableRooms.length>1){
            removeRoom(room.id)
        }
        socket.join(roomAvailable.id);
    }
    if(roomAvailable != undefined){
        room = roomAvailable;
    }
    // const room = "room" + selected;
    io.to(room.id).emit('message', formatMessage(Bot, "Please wait... Connecting you to stranger!"));
    //push the user to avilable users list
    // availableUsers.push(socket);
    io.to(room.id).emit('message', formatMessage(Bot, `you are in ` + room.id))

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.to(room.id).emit('message', formatMessage("user.username", msg));
    });
    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.to(room.id).emit('message', formatMessage("user.username", ` has left the chat`));
    });

})
// app.get("/ids",(req,res)=>{
//     res.send(availableRooms.forEach(e => console.log("id is " + e.id)))
// })
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})

