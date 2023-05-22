const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require("cors");

const app = express();
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
    console.log(fileName)
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    res.send('File uploaded successfully');
});

app.listen(port, () => {
    console.log(`FTP server is running on port ${port}`);
});
