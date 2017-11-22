var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

var port = process.env.PORT || 3000;

mongoose.connect(config.database, {
  useMongoClient: true
});

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.send('Server is succesfully run');
});

//routes
var apiRoutes = express.Router();

var authRoutes = require('./routes/auth.routes')(app, apiRoutes);

var boardRoutes = require('./routes/board.routes')(apiRoutes);

var groupRoutes = require('./routes/group.routes')(
  apiRoutes,
  passport.authenticate('jwt')
);

var taskRoutes = require('./routes/task.routes')(
  apiRoutes,
  passport.authenticate('jwt')
);

var createDbRoute = require('./routes/createdb.route')(apiRoutes);

app.use('/api', apiRoutes);

app.listen(port);
console.log(`Server is run at http://localhost:${port}`);
