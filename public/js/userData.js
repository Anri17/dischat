let logout_button = document.getElementById('logout_button');
let header_user_profile = document.getElementById('header_user_profile');
let user_profile = document.getElementById('user_profile');
let header_user_profile_username = document.getElementById('header_user_profile_username');
let header_user_profile_image = document.getElementById('header_user_profile_image');
let profile_image_file = document.getElementById('profile_image_file');

logout_button.addEventListener('click', logoutUser);

header_user_profile.addEventListener('click', () => {
    if (user_profile.style.display == 'none') {
        user_profile.style.display = 'flex';
    } else {
        user_profile.style.display = 'none';
    }
});

header_user_profile.addEventListener('mouseenter', () => {
    if (user_profile.style.display == 'none') {
        header_user_profile.style.backgroundColor = 'var(--color-0)';
    }
});

header_user_profile.addEventListener('mouseleave', () => {
    if (user_profile.style.display == 'none') {
        header_user_profile.style.backgroundColor = 'var(--color-2)';
    }
});


window.onload = fetchThisUserData(localStorage.token, (userData) => {
    header_user_profile_username.innerHTML = userData.username;
    header_user_profile_image.src = userData.image;

    fetchAllUserData((allUserData) => {
        allUserData.forEach(element => {
            buildSidebarProfileCard(element._id, element.username, element.image);
        });
    });
});

profile_image_file.addEventListener('change', (e) => {
    e.preventDefault();
    let formData = new FormData();
    let profile_image_file = document.getElementById('profile_image_file');

    formData.append('token', localStorage.token);
    if (profile_image_file.files[0] == null || profile_image_file.files[0] == undefined) {
        return console.log('pls insert an image');
    } else {
        formData.append('image', profile_image_file.files[0]);
    }
    
    fetch('/userProfileImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(response => reload());
});

var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = '/js/chatSockets.js';
document.getElementsByTagName('body')[document.getElementsByTagName('body').length -1].appendChild(newScript);