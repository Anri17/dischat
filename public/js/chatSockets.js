const socket = io.connect('http://localhost:5000');
const submitForm = document.getElementById('message_submition_form');
console.log(localStorage.token)
// Login Handling

fetchThisUserData(localStorage.token, (response) => {
    displayLoginStatus(response._id);
});

socket.emit('newUserLogin', localStorage.token);

socket.on('newUserLoginAnouncement', (userId) => {
    displayLoginStatus(userId);
});

// Message Handling
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let token = localStorage.token;
    let date = new Date();
    let message = document.getElementById('message_submition_form').elements.namedItem('text-message').value;

    socket.emit('submitChatMessage', token, date, message)
    submitForm.elements.namedItem('text-message').value = '';
    fetchThisUserData(token, (response) => {
        createMessageStructure(response.username, message, date);
    });
});

socket.on('receiveChatMessage', (username, date, message) => {
    createMessageStructure(username, message, date);
    console.log(message);
});

// Logout Handling
socket.on('disconect', () => {
    socket.emit('disconectParameters', localStorage.token);
});

socket.on('userDisconected', (disconectId) => {
    displayOfflineStatus(disconectId);
});

// Functions
function displayLoginStatus(id) {
    let myId = 'user_sidecard_' + id;
    console.log(myId);
    let userSideCard = document.getElementById(myId);
    console.log(userSideCard);
    userSideCard.style.backgroundColor = 'green';
    alert(id + ' connected');
}

function displayOfflineStatus(id) {
    let myId = 'user_sidecard_' + id;
    console.log(myId);
    let userSideCard = document.getElementById(myId);
    console.log(userSideCard);
    userSideCard.style.backgroundColor = 'none';
    alert(id + ' disconected');
}

function fetchThisUserData(token, callback) {
    fetch('/thisuserdata', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then(response => response.json())
    .then(response => {
        callback(response);
    })
}

function createMessageStructure(username, message, date) {
    let messageCard = document.createElement('div');
    messageCard.classList.add('message');
    let messageLeft = document.createElement('div');
    messageLeft.classList.add('message-left');
    messageCard.appendChild(messageLeft);
    let profileImage = document.createElement('img');
    profileImage.src = 'img/users/profile-pic.png';
    profileImage.alt = 'user image';
    messageLeft.appendChild(profileImage);

    let messageRight = document.createElement('div');
    messageRight.classList.add('message-right');
    messageCard.appendChild(messageRight);

    let messageHeader = document.createElement('div');
    let messageContent = document.createElement('span');

    messageRight.appendChild(messageHeader);
    messageRight.appendChild(messageContent);
    messageHeader.classList.add('message-header');
    messageContent.classList.add('message-content');

    messageContent.innerHTML = message;
    
    let messageUsername = document.createElement('span');
    let messageTime = document.createElement('span');

    messageHeader.appendChild(messageUsername);
    messageHeader.appendChild(messageTime);

    messageUsername.classList.add('message-username');
    messageTime.classList.add('message-time');

    messageUsername.innerHTML = username;
    messageTime.innerHTML = date.getHours() + ":" + date.getMinutes() + "   " + date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();

    let messageBox = document.getElementById('chat_messages');
    messageBox.appendChild(messageCard);
}