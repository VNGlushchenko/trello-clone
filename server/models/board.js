var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema(
  {
    title: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Board', boardSchema);
