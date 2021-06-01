require('../globals.js')
const faker = require('faker');
const users = [];
// const addUser = require('./room.js')
// Join user to chat
function createUser(id) {
  return {
    id,
    username: faker.name.firstName(),
    room: undefined
  }
}
function userJoin(user, room) {
  room.capacity++;
  user.room = room;
  onlineUsers.push(user);
  users.push(user);
}
function getRoomUsers(room) {
  return users.filter(user => user.room.id === room.id);
}
// Get current user
function getCurrentUser(id) {
  return availableUsers.find(user => user.id === id);
}

function getCurrentUserInRoom(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = onlineUsers.findIndex(user => id === user.id)
  console.log("index for online is " + index)
  if (index != -1) {
    console.log("removing online elemnet")
    return onlineUsers.splice(index, 1);
  }
}



module.exports = { userJoin, getCurrentUser, userLeave, createUser,getCurrentUserInRoom };