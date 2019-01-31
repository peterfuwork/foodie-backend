const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const multer = require("multer");
const cloudinary = require("cloudinary");
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
mongoose.connection
        .on('error', (error) => {
            console.warn('Warning', error);
        });

cloudinary.config({ 
    cloud_name: keys.cloud_name, 
    api_key: keys.api_key, 
    api_secret: keys.api_secret
})

const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("file needs to be jpeg or png format"), false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

routes(app);

// Server Setup
const PORT = process.env.PORT || 4000;
app.listen(PORT);
console.log('server listening on:', PORT);