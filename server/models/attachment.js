var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attachmentSchema = new Schema(
  {
    title: { type: String, required: true },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Attachment', attachmentSchema);
