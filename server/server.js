var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var port = process.env.PORT || 3000;
mongoose.connect(config.database, { useMongoClient: true });
app.set('jwtSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
//app.use(express.static(path.join(__dirname, 'client')));
//routes
app.get('/', function(req, res) {
  res.send('Server is succesfully run');
});

app.post('/api/test', function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.send(newUser);
  });
});

//------------------------
app.listen(port);

console.log('Server is run at http://localhost:' + port);
