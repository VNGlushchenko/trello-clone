var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
//var User   = require('./app/models/user'); // get our mongoose model
var port = process.env.PORT || 8000;
mongoose.connect(config.database);
app.set('jwtSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
//routes
app.listen(port); //ng serve --proxy-config proxy-conf.json
console.log('Server is run at http://localhost:' + port);
