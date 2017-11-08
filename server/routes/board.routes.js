var _ = require('lodash');
var Board = require('../models/board');
var Group = require('../models/group');
var Task = require('../models/task');

module.exports = function(app) {
  // Read
  app.get('/board', function(req, res) {
    Board.findOne(function(err, board) {
      if (err) res.json({ error: err });
      res.json({ _id: board._id, title: board.title });
    });
  });

  app.get('/board/:id', function(req, res) {
    Board.findById(req.params.id, function(err, board) {
      if (err) res.json({ error: err });
      if (board) {
        res.json({ _id: board._id, title: board.title });
      } else {
        res.json({ message: 'Board is not found' });
      }
    });
  });

  app.get('/board/:id/groups', function(req, res) {
    Board.findById(req.params.id, function(err, board) {
      if (err) res.json({ error: err });
      if (board) {
        Group.find(
          { boardId: req.params.id },
          { _id: 1, title: 1, boardId: 1, order: 1 }
        )
          .sort({ boardId: 1, order: 1 })
          .exec({ boardId: req.params.id }, function(err, groups) {
            if (err) res.json({ error: err });
            if (groups) {
              res.json(groups);
            }
          });
      } else {
        res.json({ message: 'Groups are not found' });
      }
    });
  });

  app.get('/board/:id/tasks', function(req, res) {
    Board.findById(req.params.id, function(err, board) {
      if (err) res.json({ error: err });
      if (board) {
        Task.find(
          { boardId: req.params.id },
          {
            _id: 1,
            title: 1,
            description: 1,
            dueDate: 1,
            boardId: 1,
            groupId: 1,
            order: 1
          }
        )
          .sort({ boardId: 1, groupId: 1, order: 1 })
          .exec({ boardId: req.params.id }, function(err, tasks) {
            if (err) throw err;
            if (tasks) res.json(tasks);
          });
      } else {
        res.json({ message: 'Tasks are not found' });
      }
    });
  });
};
