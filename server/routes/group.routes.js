var _ = require('lodash');
var Group = require('../models/group');
var Task = require('../models/task');

module.exports = function(app, strategy) {
  // Create
  app.post('/group', strategy, function(req, res) {
    var newGroup = new Group(req.body);
    newGroup.save(function(err, group) {
      if (err) res.json({ error: err });
      res.json({ message: 'Group was created successfully', group: group });
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
  app.put('/group', strategy, function(req, res) {
    Group.findById(req.body._id, function(err, group) {
      if (err) res.json({ error: err });

      if (group) {
        _.merge(group, req.body);
        group.save(function(err) {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({
              message: 'Group was updated successfully',
              group: group
            });
          }
        });
      } else {
        res.json({ message: 'Group are not found' });
      }
    });
  });

  // Delete
  app.delete('/group/:id', strategy, function(req, res) {
    Task.remove({ groupId: req.params.id }, function(err, result) {
      if (err) res.json({ error: err });
      if (result) {
        console.log(result);

        Group.findByIdAndRemove(req.params.id, function(err) {
          if (err) {
            res.json({ error: err });
          } else {
            res.json({
              message: 'Group with all its tasks were deleted successfully'
            });
          }
        });
      }
    });
  });
};
