let header_this_user = document.getElementById('header_this_user');
let logout_button = document.getElementById('logout_button');

logout_button.addEventListener('click', logoutUser);

window.onload = fetchThisUserData(localStorage.token, (userData) => {
    header_this_user.innerHTML = userData.username;
    fetchAllUserData((allUserData) => {
        allUserData.forEach(element => {
            buildSidebarProfileCard(element._id, element.username);
        });
    });
});