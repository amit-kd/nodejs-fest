
// BASE SETUP
// ==============================================

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const utility = require('./utility');
const bodyParser = require('body-parser');
const storeFile = "./User.json";
const busboy = require('connect-busboy');
const fs = require('fs');

const logger = function (req, res, next) {
    console.log('Logging > Request > ', req.url);
    next()
}
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// ROUTES
// ==============================================

app.use(busboy());
app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("Upload Finished of " + filename);
                res.redirect('back');           //where to go next
            });
        });
    });
app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/public/img/filename.jpg', function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});


// sample route with a route the way we're used to seeing it
app.get('/hello', function (req, res) {
    let op = 'Hello! Your first route is ready!';
    res.send(op);
    return;
});

// sample route with a route the way we're used to seeing it
app.get('/user/:id', function (req, res) {
    let id = req.params && req.params.id;
    fs.readFile(storeFile, (err, userData) => {
        res.send(userData && userData[id]);
        return;
    });
});

// sample route with a route the way we're used to seeing it
app.post('/register', function (req, res) {
    let userData = req.body;
    console.log(userData);
    if (userData && userData.id && userData.details) {
        fs.readFile(storeFile, (err, data) => {
            if (err)
                return res.status(500).send(err);
            if (!data.toString()) {
                data = {};
            }
            else {
                data = JSON.parse(data.toString());
            }
            data[userData.id] = userData.details;
            fs.writeFile(storeFile, JSON.stringify(data), 'utf8', (err, data) => {
                res.send(userData);
                return;
            });
        });
        return;
    }
    res.status(400).send('input invalid!');
});

// sample route with a route the way we're used to seeing it
app.post('/login', function (req, res) {
    let userData = req.body;
    if (userData && userData.id && userData.password) {
        fs.readFile(storeFile, (err, data) => {
            if (err)
                return res.status(500).send(err);
            if (!data || !data.toString()) {
                return res.status(500).send("Data is deleted!");
            }
            try {
                data = JSON.parse(data.toString());
            } catch (e) {
                return res.status(500).send("Data is corrupted!");
            }
            if (!data[userData.id]) {
                return res.status(400).send("User not present!");
            }
            if (data[userData.id].password === userData.password) {
                delete data[userData.id].password;
                return res.send(data[userData.id]);
            }
            return res.status(400).send("Password is not correct!");
        });
        return;
    }
    res.status(400).send('input invalid!');
});

// sample route with a route the way we're used to seeing it
app.put('/user', function (req, res) {
    let userData = req.body;
    fs.readFile(storeFile, function (err, data) {
        if (err)
            return res.status(500).send(err);
        if (!data || !data.toString()) {
            return res.status(500).send("Data is deleted!");
        }
        try {
            data = JSON.parse(data.toString());
        } catch (e) {
            return res.status(500).send("Data is corrupted!");
        }
        if (!data[userData.id]) {
            return res.status(400).send("User not present!");
        }
        data[userData.id].username = userData.details.username;
        fs.writeFile(storeFile, JSON.stringify(data), 'utf8', (err, data) => {
            return res.send(userData);
        });
    });
});

// sample route with a route the way we're used to seeing it
app.delete('/user/:id', function (req, res) {
    let id = req.params && req.params.id;
    fs.readFile(storeFile, function (err, data) {
        let deletedData;
        if (err)
            return res.status(500).send(err);
        if (!data || !data.toString()) {
            return res.status(500).send("Data is deleted!");
        }
        try {
            data = JSON.parse(data.toString());
        } catch (e) {
            return res.status(500).send("Data is corrupted!");
        }
        if (!data[id]) {
            return res.status(400).send("User not present!");
        }
        deletedData = data[id];
        delete data[id];
        fs.writeFile(storeFile, JSON.stringify(data), 'utf8', (err, data) => {
            return res.send(data);
        });
    });
});

// sample logger to use for all routes
app.use(logger);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    return next();
});

app.use('/static', express.static('public'))

// we'll create our routes here

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Server started on port ' + port);
