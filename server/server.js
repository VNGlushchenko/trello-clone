var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var port = process.env.PORT || 3000;
mongoose.connect(config.database, {
  useMongoClient: true
});
app.set('jwtSecret', config.secret);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(morgan('dev'));
//app.use(express.static(path.join(__dirname, 'client')));
//routes
app.get('/', function(req, res) {
  res.send('Server is succesfully run');
});

app.get('/mongo', function(req, res) {
  User.find({}).exec(function(err, users) {
    if (err) throw err;

    console.log(users);
    res.json(users);
  });
});
app.post('/api/test', function(req, res) {
  var signUpErrorMasseges = {};

  if (!req.body.userName) {
    signUpErrorMasseges.userName = 'user name is empty';
  }

  if (!req.body.email) {
    signUpErrorMasseges.email = 'email is empty';
  }

  if (!req.body.password) {
    signUpErrorMasseges.password = 'password is empty';
  }

  if (!req.body.confirmedPassword) {
    signUpErrorMasseges.confirmedPassword = 'password is empty';
  }

  if (req.body.password != req.body.confirmedPassword) {
    signUpErrorMasseges.passwordsChecking = 'passwords do not match each other';
  }

  if (Object.keys(signUpErrorMasseges).length) {
    res.status(400).send(signUpErrorMasseges);
  }
  var existingEmail = '';

  User.find(
    {
      email: req.body.email
    },
    {
      email: 1
    }
  ).exec(function(err, email) {
    if (err) throw err;

    if (email.length) {
      existingEmail = email[0].email;
      console.log(email);
      res.status(400).send('User with such e-mail already exists');
    } else {
      var newUser = new User({
        name: req.body.userName,
        email: req.body.email,
        password: req.body.password
      });

      newUser.save(function(err) {
        if (err) throw err;

        console.log('User has been successfully saved');
        res.status(200).send({ message: 'You have successfully registered' });
      });
    }
  });
});
//------------------------
app.listen(port);

console.log('Server is run at http://localhost:' + port);
