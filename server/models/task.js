var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    order: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
