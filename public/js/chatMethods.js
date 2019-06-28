// DOM Manipulation
function createMessageStructure(username, date, message) {
    let messageBox = document.getElementById('chat_messages');
    let newDate = new Date(date);
    let messageCard = document.createElement('div');
    messageBox.appendChild(messageCard);
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
    messageTime.innerHTML = newDate.getHours() + ":" + newDate.getMinutes() + "   " + newDate.getDay() + "/" + newDate.getMonth() + "/" + newDate.getFullYear();
}

function buildSidebarProfileCard(id, username) {
    let userList = document.getElementById('user_list');
    let userCard = document.createElement('div');
    userList.appendChild(userCard);
    userCard.id = 'user_sidecard_' + id;
    userCard.classList.add('user');
    let userImage = document.createElement('img');
    userImage.src = 'img/users/profile-pic.png';
    userImage.art = 'Sidebar profile image of username: ' + username;
    let usernameField = document.createElement('span');
    usernameField.innerHTML = username;
    userCard.appendChild(userImage);
    userCard.appendChild(usernameField);
}

function scrollDivToBottom(id){ 
    let element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
}

function displayOnlineStatus(id) {
    document.getElementById('user_sidecard_' + id).style.opacity = '1';
    document.getElementById('user_sidecard_' + id).style.filter = 'alpha(opacity = 100)';
}

function displayOfflineStatus(id) {
    document.getElementById('user_sidecard_' + id).style.opacity = '0.4';
    document.getElementById('user_sidecard_' + id).style.filter = 'alpha(opacity = 40)';
}

// User Data Gathering
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

function fetchAllUserData(callback) {
    fetch('/alluserdata', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        callback(response);
    })
}

function fetchUserData(id, callback) {
    fetch('/userdata', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    })
    .then(response => response.json())
    .then(response => callback(response));
}

function fetchChatMessages(callback) {
    fetch('/chat-messages', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => callback(response));
}

function logoutUser() {
    localStorage.token = '';
    location.replace('/login');
}

function sortMessages(arr, callback) {
    let sortedMessages = arr.sort((a, b) => {
        a = new Date(a.date);
        b = new Date(b.date);
        return a<b ? -1 : a>b ? 1 : 0;
    });
    return callback(sortedMessages);
}