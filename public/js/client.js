const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const activeUsers = document.getElementById('active-users');
// Message from server
socket.on('reload', () => {
  location.reload();
})

socket.on('onlineUsers', length => {
  activeUsers.innerHTML = length;
})



socket.on('message', message => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  console.log(message.text);
  
  const div = document.createElement('div');
  div.classList.add('message');
  if (message.username == "Welcome Bot ")
    div.style.backgroundColor = '#5cb85c';
  else
    div.style.backgroundColor = message.color;
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}



