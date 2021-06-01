require("../globals.js")

function createRoom(id) {
    const room = {
        id,
        capacity: 0,
    };
    availableRooms.push(room)
    return room;
}

// function addUser(user,room){
//     if(!room.users.includes(user) && room.users.length < 2){
//         room.users.push(user);
//         user.addRoom(room);
//     }
// }

function removeRoom(id) {
    const index = findRoom(id);
    console.log("Index is " + index)
    if(index != -1){
        availableRooms.splice(index,1);
        // console.log("removing empty room")
    }
}
function findRoom(id) {
    return availableRooms.findIndex(room => room.id === id);
}
function availableRoom(){
    const room = availableRooms.find(room => room.capacity < 2);
    return room;
}
module.exports = {createRoom,removeRoom,findRoom,availableRoom};