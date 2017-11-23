var Board = require('../models/board');
var Group = require('../models/group');
var Task = require('../models/task');

module.exports = function(app) {
  app.get('/createdb', function(req, res) {
    var board1 = new Board({
      title: 'Board #1'
    });

    board1.save(function(err) {
      if (err) throw err;
      console.log('Board item has been successfully created');
      console.log(board1);
      //--------------------------------------------------------------
      var group1 = new Group({
        title: 'group #1',
        boardId: board1._id,
        order: 1
      });

      group1.save(function(err) {
        if (err) throw err;
        console.log('Group item has been successfully created');
        console.log(group1);
        //-------------------------------
        var task1 = new Task({
          title: 'Task #1',
          description: 'Do task #1',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          boardId: board1._id,
          groupId: group1._id,
          order: 1
        });

        task1.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task1);
        });
        //--------------------------------
        var task2 = new Task({
          title: 'Task #2',
          description: 'Do task #2',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
          boardId: board1._id,
          groupId: group1._id,
          order: 2
        });

        task2.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task2);
        });
        //----------------------------------
        var task3 = new Task({
          title: 'Task #3',
          description: 'Do task #3',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
          boardId: board1._id,
          groupId: group1._id,
          order: 3
        });

        task3.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task3);
        });
      });
      //--------------------------------------------------------------
      var group2 = new Group({
        title: 'group #2',
        boardId: board1._id,
        order: 2
      });

      group2.save(function(err) {
        if (err) throw err;
        console.log('Group item has been successfully created');
        console.log(group2);
        //-------------------------------
        var task4 = new Task({
          title: 'Task #4',
          description: 'Do task #4',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 4)),
          boardId: board1._id,
          groupId: group2._id,
          order: 1
        });

        task4.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task4);
        });
        //--------------------------------
        var task5 = new Task({
          title: 'Task #5',
          description: 'Do task #5',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
          boardId: board1._id,
          groupId: group2._id,
          order: 2
        });

        task5.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task5);
        });
        //----------------------------------
        var task6 = new Task({
          title: 'Task #6',
          description: 'Do task #6',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 6)),
          boardId: board1._id,
          groupId: group2._id,
          order: 3
        });

        task6.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task6);
        });
      });
      //--------------------------------------------------------------------
      var group3 = new Group({
        title: 'group #3',
        boardId: board1._id,
        order: 3
      });

      group3.save(function(err) {
        if (err) throw err;
        console.log('Group item has been successfully created');
        console.log(group3);
        //-------------------------------
        var task7 = new Task({
          title: 'Task #7',
          description: 'Do task #7',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          boardId: board1._id,
          groupId: group3._id,
          order: 1
        });

        task7.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task7);
        });
        //--------------------------------
        var task8 = new Task({
          title: 'Task #8',
          description: 'Do task #8',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
          boardId: board1._id,
          groupId: group3._id,
          order: 2
        });

        task8.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task8);
        });
        //----------------------------------
        var task9 = new Task({
          title: 'Task #9',
          description: 'Do task #9',
          dueDate: new Date(new Date().setDate(new Date().getDate() + 9)),
          boardId: board1._id,
          groupId: group3._id,
          order: 3
        });

        task9.save(function(err) {
          if (err) throw err;
          console.log('Task item has been successfully created');
          console.log(task9);
        });
      });
    });

    res.send('Board with groups of tasks was succesfully created');
  });
};
