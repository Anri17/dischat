const alert = document.querySelector('#alert');



// TODO: display an alert when something goes wrong during register and login. 
function displayAlert(content, backgroundColor) {
    alert.style.backgroundColor = backgroundColor;
    alert.style.display = 'flex';
    alert.innerHTML = content;
}