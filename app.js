var express = require('express');
var app = express();
var birds = require('./router')
const port = process.env.PORT || 8080;

app.listen(port);
console.log('Server started on port ' + port);

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
})

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage')
})

app.all('/secret', function (req, res, next) {
    console.log('Accessing the secret section ...')
    next() // pass control to the next handler
})
app.get('/secret', function (req, res, next) {
    res.send('Accessing the secret section ...')
})
app.get(/.*plane$/, function (req, res) {
    res.send(req.url)
})
app.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
})
app.get('/example/b', function (req, res, next) {
    console.log('the response will be sent by the next function ...')
    next()
}, function (req, res) {
    res.send('Hello from B!')
})
app.route('/book')
    .get(function (req, res) {
        res.send('Get a random book')
    })
    .post(function (req, res) {
        res.send('Add a book')
    })
    .put(function (req, res) {
        res.send('Update the book')
    })
app.use('/birds', birds)