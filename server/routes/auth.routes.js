var express = require('express');
var app = express();
var config = require('../config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
const jwtSecret = config.secret;
var User = require('../models/user');

module.exports = function(app, api) {
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

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
  };

  passport.use(
    new JwtStrategy(jwtOptions, function(payload, done) {
      User.findById(payload.client, (err, user) => {
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

  // user registration - BEGIN

  api.post('/signup', function(req, res) {
    // signUp form fields validation - BEGIN
    var signUpErrorMessages = {};

    if (!req.body.userName.trim()) {
      signUpErrorMessages.userName = 'User name is empty';
    }

    if (!!!req.body.email.match(/^.+@.+\..+$/gim)) {
      signUpErrorMessages.email = 'Email is incorrect';
    }

    if (!req.body.password) {
      signUpErrorMessages.password = 'Password is empty';
    }

    if (req.body.password && req.body.password.length < 8) {
      signUpErrorMessages.passwordLength =
        'Password must contain 8 symbols at least';
    }

    if (!req.body.confirmedPassword) {
      signUpErrorMessages.confirmedPassword = 'Password is empty';
    }

    if (
      req.body.password &&
      req.body.confirmedPassword &&
      req.body.password != req.body.confirmedPassword
    ) {
      signUpErrorMessages.passwordsChecking =
        'Passwords do not match each other';
    }

    if (Object.keys(signUpErrorMessages).length) {
      res.status(400).send(signUpErrorMessages);
    }
    // signUp form fields validation - END

    // user creation
    User.find(
      {
        email: req.body.email
      },
      {
        email: 1
      }
    ).exec(function(err, userData) {
      if (err) throw err;

      if (userData.length) {
        res.status(400).send({
          message: `User with such email already exists.`
        });
      } else {
        var newUser = new User({
          name: req.body.userName,
          email: req.body.email,
          password: req.body.password
        });

        newUser.save(function(err, user) {
          if (err) throw err;

          const payload = {
            client: user._id,
            uid: user.email,
            exp: new Date().setDate(new Date().getDate() + 1)
          };

          const token = jwt.sign(payload, jwtSecret);

          res.json({
            message: 'You have successfully registered.',
            user: user.email,
            token: token
          });
        });
      }
    });
  });
  // user registration - END

  // user authentication
  api.post('/signin', passport.authenticate('local'), function(req, res) {
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
};
