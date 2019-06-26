const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});

const registerRouter = require('./routers/register.js').router;
const loginRouter = require('./routers/login.js').router;
const chatRouter = require('./routers/chat.js').router;
const userDataRouter = require('./routers/userData.js').router;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public', 'login.html')));
app.use('/register', express.static(path.join(__dirname, 'public', 'register.html')));
app.use('/chat', express.static(path.join(__dirname, 'public', 'chat.html')));

app.use(registerRouter);
app.use(loginRouter);
app.use(chatRouter);
app.use(userDataRouter);