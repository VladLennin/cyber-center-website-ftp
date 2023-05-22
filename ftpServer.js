const express = require('express');
const { FtpSrv } = require('ftp-srv');

const app = express();
const port = 3006;

const ftpServer = new FtpSrv({
    url: `ftp://127.0.0.1:${port}`,
    pasv_range: '40000-50000', // Port range for passive mode data transfer
    anonymous: true, // Allowing anonymous access
    greeting: 'Welcome to my FTP server', // Greeting message for clients
});

ftpServer.on('login', ({ username, password }, resolve, reject) => {
    // Authenticating the user
    if (username === 'admin' && password === '123456') {
        resolve({ root: '/uploads' }); // Path to the root directory for authenticated user
    } else {
        reject('Invalid username or password');
    }
});

// Express route for handling FTP requests
app.use((req, res, next) => {
    ftpServer.emit('request', req, res);
});

ftpServer.listen()
    .then(() => {
        console.log('FTP server is running');
    })
    .catch((err) => {
        console.error('Error starting FTP server:', err);
    });

