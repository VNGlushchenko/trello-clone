var _ = require('lodash');
var Group = require('../models/group');
var Task = require('../models/task');

module.exports = function(app, strategy) {
  // Create
  app.post('/group', strategy, function(req, res) {
    var newGroup = new Group(req.body);
    newGroup.save(function(err, group) {
      if (err) res.json({ error: err });
      res.json(group);
    });
  });

  // Read
  app.get('/group', function(req, res) {
    Group.find(function(err, groups) {
      if (err) res.json({ error: err });
      res.json(groups);
    });
  });

  app.get('/group/:id', function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) res.json({ error: err });
      if (group) {
        res.json(group);
      } else {
        res.json({ message: 'Group are not found' });
      }
    });
  });

  app.get('/group/:id/tasks', function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) res.json({ error: err });
      if (group) {
        Task.find({ groupId: req.params.id })
          .sort({ order: 1 })
          .exec(function(err, tasks) {
            if (err) throw err;
            res.json(tasks);
          });
      } else {
        res.json({ message: 'Group are not found' });
      }
    });
  });

  /* Update */
  app.put('/group/:id', strategy, function(req, res) {
    Group.findById(req.params.id, function(err, group) {
      if (err) res.json({ error: err });
      if (group) {
        _.merge(group, req.body);
        column.save(function(err) {
          if (err) {
            res.json({ error: err });
          }
          res.json({ message: 'Group was updated successfully' });
        });
      } else {
        res.json({ message: 'Group are not found' });
      }
    });
  });

  // Delete
  app.delete('/group/:id', strategy, function(req, res) {
    Group.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        res.json({ error: err });
      }
      res.json({ message: 'Group was deletes successfully' });
    });
  });
};
