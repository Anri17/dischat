window.onload = fetchChatMessages((messages) => {
    let sortedMessages = messages.sort((a, b) => {
        a = new Date(a.date);
        b = new Date(b.date);
        return a<b ? -1 : a>b ? 1 : 0;
    });

    console.log(sortedMessages);

    getMessage(sortedMessages, (element) => {
        fetchUserData(element.userid, (userData) => {
            createMessageStructure(userData.username, element.message, new Date(element.date));
        });
        scrollToBottom('chat_messages');
    });
});

function scrollToBottom(id){
    var div = document.getElementById(id);
    console.log(div.scrollTop, div.scrollHeight);
    div.scrollTop = div.scrollHeight - div.clientHeight;
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

async function getMessage(messages, callback) {
    await messages.forEach(async element => await callback(element));
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