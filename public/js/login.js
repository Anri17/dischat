const login_form = document.getElementById('login_form');
login_form.addEventListener('submit', loginUser);
let alertbox = document.getElementById('alert');
alertbox.addEventListener('click', () => {alertbox.style.display = 'none'});

function loginUser(e) {
    e.preventDefault();
    let email = login_form.elements.namedItem('email').value;
    let password = login_form.elements.namedItem('password').value;
    login_form.elements.namedItem('email').value = '';
    login_form.elements.namedItem('password').value = '';
    submitData(email, password);
}

function submitData(email, password) {
    let data = {
        email: email,
        password: password
    };

    fetch('/login-user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if (response == 'empty email') {
            displayAlert('Email field is empty');
        } else if (response == 'empty password') {
            displayAlert('Password field is empty');
        } else if (response == 'wrong password') {
            displayAlert('Wrong Password. Please try again');
        } else if (response == 'no user') {
            displayAlert('No user found');
        } else if (response.token != null || response.token != undefined) {
            localStorage.setItem("token", response.token);
            window.location.replace('/chat');
        }
    });
}

function displayAlert(message) {
    alertbox.style.display = 'flex';
    alertbox.innerHTML = message;
}

