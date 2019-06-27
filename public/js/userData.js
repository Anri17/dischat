let header_this_user = document.getElementById('header_this_user');
let logout_button = document.getElementById('logout_button');

logout_button.addEventListener('click', logout);

window.onload = verifyToken();

console.log(localStorage.token);

function verifyToken() {
    fetchThisUserData(localStorage.token, (userData) => {
        header_this_user.innerHTML = userData.username;
        fetchAllUserData((allUserData) => {
            allUserData.forEach(element => {
                buildSidebarProfileCard(element._id, element.username);
            });
            displayLoginStatus(userData._id);
        });
    });
}

function displayLoginStatus(id) {
    let myId = 'user_sidecard_' + id;
    console.log(myId);
    let userSideCard = document.getElementById(myId);
    console.log(userSideCard);
    userSideCard.style.backgroundColor = 'green';
}

function logout() {
    localStorage.token = '';
    location.replace('/login');
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
        console.log(response);
        callback(response);
    })
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