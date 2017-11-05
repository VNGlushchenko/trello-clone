var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    passwordHash: { type: String, required: true /* , select: false  */ },
    email: {
      type: String,
      required: 'Enter an e-mail',
      unique: 'Such e-mail already exists',
      validate: {
        validator: function(param) {
          return !!param.match(/^.+@.+\..+$/gim);
        },
        message: 'Enter a correct email'
      }
    },
    salt: String
  },
  {
    timestamps: true
  }
);

userSchema
  .virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1,
        128,
        'sha1'
      );
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false;
  if (!this.passwordHash) return false;

  return (
    crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash
  );
};

module.exports = mongoose.model('User', userSchema);
