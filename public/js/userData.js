let logout_button = document.getElementById('logout_button');
let header_user_profile = document.getElementById('header_user_profile');
let user_profile = document.getElementById('user_profile');
let header_user_profile_username = document.getElementById('header_user_profile_username');
let header_user_profile_image = document.getElementById('header_user_profile_image');
let user_profile_image_upload_form = document.getElementById('user_profile_image_upload_form');

logout_button.addEventListener('click', logoutUser);
header_user_profile.onclick = () => {
    user_profile.style.display == 'none' ? user_profile.style.display = 'block' : user_profile.style.display = 'none';
};

window.onload = fetchThisUserData(localStorage.token, (userData) => {
    header_user_profile_username.innerHTML = userData.username;
    header_user_profile_image.src = userData.image;

    fetchAllUserData((allUserData) => {
        allUserData.forEach(element => {
            buildSidebarProfileCard(element._id, element.username, element.image);
        });
    });
});

user_profile_image_upload_form.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData();
    let profile_image_file = document.getElementById('profile_image_file');

    formData.append('token', localStorage.token);
    formData.append('image', profile_image_file.files[0]);
    
    fetch('/userProfileImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(response => console.log('success: ', response));
});

var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = '/js/chatSockets.js';
document.getElementsByTagName('body')[document.getElementsByTagName('body').length -1].appendChild(newScript);