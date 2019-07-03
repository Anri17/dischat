const socket = io.connect();
const submitForm = document.getElementById('message_submition_form');

// Login Handling
socket.emit('newUserLogin', localStorage.token);

socket.on('online', (message) => {
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
    let message = document.getElementById('message_submition_form_content').value;

    socket.emit('submitChatMessage', token, date, message)
    submitForm.elements.namedItem('text-message').value = '';
});

submitForm.elements.namedItem('text-message').addEventListener('keypress', (e) => {
    if (e.which == 13 && !e.shiftKey) {
        let token = localStorage.token;
        let date = new Date();
        let message = '<pre>' + document.getElementById('message_submition_form_content').value + '</pre>';

        socket.emit('submitChatMessage', token, date, message)
        submitForm.elements.namedItem('text-message').value = '';

        e.preventDefault();
        console.log('hey');
    }
})

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

// ADMIN CODE
const admin_delete_messages = document.getElementById('admin_delete_messages');

admin_delete_messages.addEventListener('click', () => {
    socket.emit('deleteMessages');
});

socket.on('deleteMessages', () => {
    document.getElementById('chat_messages').innerHTML = '';
    console.log('DEBUG: messages deleted');
})
