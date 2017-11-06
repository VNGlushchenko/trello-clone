var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema(
  {
    title: { type: String, required: true },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true
    },
    order: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Group', groupSchema);
