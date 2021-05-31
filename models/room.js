require("../globals.js")
function createRoom(id) {
    const room = {
        id,
        capacity: 0
    };
    availableRooms.push(room)
    return room;
}

function removeRoom(id) {
    const index = findRoom(id);
    if(index != -1){
        availableRooms.splice(index,1);
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