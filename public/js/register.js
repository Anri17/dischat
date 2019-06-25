const register_form = document.getElementById('register_form');
register_form.addEventListener('submit', registerUser);
let alertbox = document.getElementById('alert');
alertbox.addEventListener('click', () => {alertbox.style.display = 'none'});

function registerUser(e) {
    e.preventDefault();
    let username = register_form.elements.namedItem('username').value;
    let email = register_form.elements.namedItem('email').value;
    let password = register_form.elements.namedItem('password').value;
    let re_password = register_form.elements.namedItem('re_password').value;
    register_form.elements.namedItem('username').value = '';
    register_form.elements.namedItem('email').value = '';
    register_form.elements.namedItem('password').value = '';
    register_form.elements.namedItem('re_password').value = '';
    submitData(username, email, password, re_password);
}

function submitData(username, email, password, re_password) {
    let data = {
        username: username,
        email: email,
        password: password,
        re_password: re_password
    };

    fetch('/register-user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response == 'no username') {
            displayAlert('Username field is empty');
        } else if (response == 'no email') {
            displayAlert('Email field is empty');
        } else if (response == 'no password') {
            displayAlert('Password field is empty');
        } else if (response == 'password not equal') {
            displayAlert('Password fields are not equal');
        } else if (response == 'email exists') {
            displayAlert('Email already in use');
        } else if (response == 'username exists') {
            displayAlert('Username already in use');
        } else if (response == 'success') {
            window.location.replace('/login');
        }
    });
}

function displayAlert(message) {
    alertbox.style.display = 'flex';
    alertbox.innerHTML = message;
}