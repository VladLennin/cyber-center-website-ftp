const express = require('express');
const https = require('https')
const fs = require('fs');
const http = require('http')
const path = require('path');
const multer = require('multer');
const cors = require("cors");

const absolutePath = path.resolve('')


const app = express();

var httpServer = http.createServer(app);


app.use(cors())
const port = 3005;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

app.get('/ftp/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    res.download(filePath, filename);
});

app.post('/ftp/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const fileName = req.body.fileName
    file.filename = fileName
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    res.send('File uploaded successfully');
});

httpServer.listen(port, () => {
    console.log(`FTP server is running on port ${port}`);
});

