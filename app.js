const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;

const registerRouter = require('./routers/register.js').router;
const loginRouter = require('./routers/login.js').router;
const userDataRouter = require('./routers/userData.js').router;
const chatMessagesRouter = require('./routers/chatMessages.js').router;
const chatSocketsRouter = require('./routers/chatSockets.js').router;
const chatIoServer = require('./routers/chatSockets.js').ioServer;
const userProfileRouter = require('./routers/userProfile.js').router;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public', 'login.html')));
app.use('/register', express.static(path.join(__dirname, 'public', 'register.html')));
app.use('/chat', express.static(path.join(__dirname, 'public', 'chat.html')));

app.use(registerRouter);
app.use(loginRouter);
app.use(userDataRouter);
app.use(chatMessagesRouter);
app.use(chatSocketsRouter);
app.use(userProfileRouter);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});

const io = require('socket.io')(server);
chatIoServer(io);