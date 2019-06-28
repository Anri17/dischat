window.onload = fetchChatMessages((messages) => {
    sortMessages(messages, (sortedMessages) => {
        sortedMessages.forEach(element => {
            fetchUserData(element.userid, (userData) => {
                createMessageStructure(userData.username, new Date(element.date), element.message);
            });
        });
    });
});

var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = '/js/chatSockets.js';
document.getElementsByTagName('body')[document.getElementsByTagName('body').length -1].appendChild(newScript);