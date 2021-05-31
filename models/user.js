require('../globals.js')

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  onlineUsers.push(user);
  room.capacity++;
  return user;
}

// Get current user
function getCurrentUser(id) {
  return availableUsers.find(user => user.id === id);
}

// User leaves chat
function userLeave(id, username, room) {
  const toFind = { id, username, room };
  const index = availableUsers.findIndex(user => toFind === user)
  if (index !== -1) {
    return availableUsers.splice(index, 1)[0];
  }
}

// Get room users


module.exports = { userJoin, getCurrentUser, userLeave };