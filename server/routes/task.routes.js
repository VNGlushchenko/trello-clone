var _ = require('lodash');
var async = require('async');
var Task = require('../models/task');

module.exports = function(app, strategy) {
  // Create
  app.post('/task', strategy, function(req, res) {
    var newTask = new Card(req.body);
    newTask.save(function(err, task) {
      if (err)
        res.json({
          error: err
        });
      res.json(task);
    });
  });

  // Read
  app.get('/task', function(req, res) {
    Task.find(function(err, tasks) {
      if (err)
        res.json({
          error: err
        });
      res.json(tasks);
    });
  });

  app.get('/task/:id', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
      if (err)
        res.json({
          error: err
        });
      if (task) {
        res.json(task);
      } else {
        res.json({
          message: 'Task is not found'
        });
      }
    });
  });

  // Update
  app.put('/task', strategy, function(req, res) {
    console.log(req.body.data);
    Task.findById(req.body.data._id, function(err, task) {
      if (err)
        res.json({
          error: err
        });
      if (task) {
        _.merge(task, req.body);

        task.save(function(err, task) {
          if (err)
            res.json({
              error: err
            });

          if (task) {
            res.json({
              message: 'Task was updated successfully',
              updTask: task
            });
          } else {
            res.json({
              message: 'Task is not found'
            });
          }
        });
      }
    });
  });

  app.put('/tasks', strategy, function(req, res) {
    var inputData = req.body.data;

    async.each(
      inputData,
      function(taskItem, callback) {
        Task.findById(taskItem._id, function(err, task) {
          if (err)
            callback({
              error: err
            });

          if (task) {
            _.merge(task, taskItem);
            task.save(function(err, task) {
              if (err)
                callback({
                  error: err
                });

              console.log('Updated', task);
              callback();
            });
          }
        });
      },
      function(err) {
        if (err) {
          res.json({
            message: "Tasks' updating failed"
          });
        } else {
          res.json({
            message: 'Tasks were updated successfully',
            inputData: inputData
          });
        }
      }
    );
  });

  //Delete
  app.delete('/task/:id', strategy, function(req, res) {
    Task.findByIdAndRemove(req.params.id, function(err, task) {
      if (err)
        res.json({
          error: err
        });

      if (!task) {
        res.json({
          message: 'Task does not exist'
        });
      } else {
        res.json({
          message: 'Task was deleted successfully'
        });
      }
    });
  });
};
