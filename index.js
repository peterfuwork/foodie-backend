const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const multer = require("multer");
const cloudinary = require("cloudinary");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/routes');

mongoose.connect(process.env.MONGODB_URI || keys.mongoURI, { useNewUrlParser: true });
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
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

routes(app);

app.use(notFound)
app.use(errorHandler)

function notFound(req, res, next) {
  res.status(404).send({error: 'Not found!', status: 404, url: req.originalUrl})
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined
  res.status(500).send({error: err.message, stack, url: req.originalUrl})
}

// Server Setup
const PORT = process.env.PORT || 4000;
app.listen(PORT)
  .on('error',     console.error.bind(console))
  .on('listening', console.log.bind(console, 'Listening on http://0.0.0.0:' + PORT))