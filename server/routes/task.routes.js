var _ = require('lodash');
var Task = require('../models/task');

module.exports = function(app, strategy) {
  // Create
  app.post('/task', strategy, function(req, res) {
    var newTask = new Card(req.body);
    newTask.save(function(err, task) {
      if (err) res.json({ error: err });
      res.json(task);
    });
  });

  // Read
  app.get('/task', function(req, res) {
    Task.find(function(err, tasks) {
      if (err) res.json({ error: err });
      res.json(tasks);
    });
  });

  app.get('/task/:id', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
      if (err) res.json({ error: err });
      if (task) {
        res.json(task);
      } else {
        res.json({ message: 'Task is not found' });
      }
    });
  });

  // Update
  app.put('/task/:id', strategy, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
      if (err) res.json({ error: err });
      if (task) {
        _.merge(task, req.body);
        task.save(function(err) {
          if (err) res.json({ error: err });
          res.json({ message: 'Task was updated successfully' });
        });
      } else {
        res.json({ message: 'Task is not found' });
      }
    });
  });

  //Delete
  app.delete('/task/:id', strategy, function(req, res) {
    Task.findByIdAndRemove(req.params.id, function(err) {
      if (err) res.json({ error: err });
      res.json({ message: 'Task was deleted successfully' });
    });
  });
};
