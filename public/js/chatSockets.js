const socket = io.connect();
const submitForm = document.getElementById('message_submition_form');


// Login Handling
socket.emit('newUserLogin', localStorage.token);

socket.on('online', (message) => {
    console.log(message);
    message.forEach(element => {
        createMessageStructure(element.user.username, element.date, element.message, element.user.image);
    });
});

socket.on('newUserLoginAnouncement', (userList) => {
    setTimeout(() => {
        for (let key in userList) {
            displayOnlineStatus(userList[key]);
        }
        scrollDivToBottom('chat_messages');
    }, 100)
});

// Message Handling
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let token = localStorage.token;
    let date = new Date();
    let message = document.getElementById('message_submition_form').elements.namedItem('text-message').value;

    socket.emit('submitChatMessage', token, date, message)
    submitForm.elements.namedItem('text-message').value = '';
});

socket.on('receiveChatMessage', (username, date, message, image) => {
    createMessageStructure(username, date, message, image);
    if (document.getElementById('chat_messages').scrollTop >= document.getElementById('chat_messages').scrollHeight - 900) scrollDivToBottom('chat_messages');
    console.log(username + ": " + message);
});

// Logout Handling
socket.on('disconnect', () => {
    socket.disconnect();
});

socket.on('userDisconnected', (disconnectId) => {
    console.log(disconnectId + " has disconnected");
    displayOfflineStatus(disconnectId);
});