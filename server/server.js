var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
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
const jwtSecret = config.secret;
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    function(username, password, done) {
      User.findOne({ email: username }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user || !user.checkPassword(password)) {
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);
//------------------------
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

passport.use(
  new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload.id, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  })
);
//routes
var apiRoutes = express.Router();
apiRoutes.get('/', function(req, res) {
  res.send('Server is succesfully run');
});

apiRoutes.get('/mongo', function(req, res) {
  User.find({}).exec(function(err, users) {
    if (err) throw err;

    res.json(users);
  });
});
apiRoutes.post('/signup', function(req, res) {
  var signUpErrorMasseges = {};

  if (!req.body.userName.trim()) {
    signUpErrorMasseges.userName = 'user name is empty';
  }

  if (!!!req.body.email.match(/^.+@.+\..+$/gim)) {
    signUpErrorMasseges.email = 'email is incorrect';
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

      res.status(400).send({
        message: 'User with such email already exists.'
      });
    } else {
      var newUser = new User({
        name: req.body.userName,
        email: req.body.email,
        password: req.body.password
      });

      newUser.save(function(err) {
        if (err) throw err;

        console.log('User has been successfully saved');
        res.status(200).send({
          message: 'You have successfully registered.'
        });
      });
    }
  });
});
//------------------------
apiRoutes.post('/signin', passport.authenticate('local'), function(req, res) {
  const payload = {
    client: req.user.id,
    uid: req.user.email,
    exp: new Date().setDate(new Date().getDate() + 1)
  };
  const token = jwt.sign(payload, jwtSecret);

  res.json({
    user: req.user.email,
    token: token
  });
});
//----------------------------
app.use('/api', apiRoutes);
//----------------------------
app.listen(port);
console.log('Server is run at http://localhost:' + port);
