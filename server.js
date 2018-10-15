
// BASE SETUP
// ==============================================

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
const utility = require('Utility');
var bodyParser = require('body-parser');
const storeFile = "User.json";
const fileUpload = require('express-fileupload');

var logger = function (req, res, next) {
    console.log('Logging')
    next()
}


// ROUTES
// ==============================================

// default options
app.use(fileUpload());
app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/somewhere/on/your/server/filename.jpg', function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});


// sample route with a route the way we're used to seeing it
app.get('/hello', function (req, res) {
    let op = 'Hello! Your first route is ready!';
    res.send(op);
});

// sample route with a route the way we're used to seeing it
app.get('/user/:id', function (req, res) {
    let id = req.params && req.params.id;
    utility.getreadFileAsJson(storeFile, function (err, userData) {
        return userData && userData[id];
    });
});

// sample route with a route the way we're used to seeing it
app.post('/login', function (req, res) {
    let userData = req.body();

});

// sample route with a route the way we're used to seeing it
app.put('/user', function (req, res) {
    let id = req.params && req.params.id;
    utility.getreadFileAsJson(storeFile, function (err, userData) {
        return userData && userData[id];
    });
});

// sample route with a route the way we're used to seeing it
app.delete('/user', function (req, res) {
    let id = req.params && req.params.id;
    utility.getreadFileAsJson(storeFile, function (err, userData) {
        return userData && userData[id];
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

// we'll create our routes here

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Server started on port ' + port);
