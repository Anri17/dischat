const socket = io.connect('http://localhost:3000');
const messageForm = document.getElementById('messageSubmit');
const chatBox = document.getElementById("chatBox");
let messageInput = document.getElementById('messageInput');
let name = prompt("Write your email please");

// Login Message
displayLoginMessage(name);
socket.emit('newUserLogin', name);

socket.on('chatMessage', (message, username) => {
    appendChatMessage(username, message);
    console.log(message);
});

socket.on('newUserLoginAnouncement', (username) => {
    displayLoginMessage(username);
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    let message = messageInput.value;
    socket.emit('chatMessageSubmit', message);
    messageInput.value = '';
    appendChatMessage(name, message);
});

// User Disconnect
socket.on('disconect', () => {
    socket.disconnect();
});

socket.on('userDisconected', (disconnectUser) => {
    let disconnectMessage = document.createElement('p');
    disconnectMessage.innerHTML = `${disconnectUser} Has Left The Server`;
    chatBox.appendChild(disconnectMessage);
});

function storeSession() {
    
}

function displayLoginMessage(username) {
    let loginMessage = document.createElement('p');
    loginMessage.innerHTML = `${username} Has Joined The Server`
    chatBox.appendChild(loginMessage);
}

function appendChatMessage(username, message) {
    let messageBody = document.createElement('p');
    chatBox.appendChild(messageBody);
    messageBody.innerHTML = `${username}: ${message}`;
}