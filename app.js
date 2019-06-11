const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public', 'login.html')));
app.use('/register', express.static(path.join(__dirname, 'public', 'register.html')));
app.use('/chat', express.static(path.join(__dirname, 'public', 'chat.html')));


app.listen(PORT, () => console.log(`App started at on port ${PORT}!`));