const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    maxlength: [100, 'Maximum length of Name is 100']
  },
  dp: String,
  lastName: {
    type: String,
    maxlength: [100, 'Maximum length of Name is 100']
  },
  points: Number,
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    maxlength: [100, 'Maximum length of Name is 100']
  },
  email: {
    type: String,
    required: [true, "User's email id is required"],
    unique: true,
    lowercase: true,
  },
  email_verified: Boolean,
  bookmarks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }
  ],
  private: Boolean,
  ///////
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  ///////
  // photo: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [100, 'Password can not be more than 100 characters long']
    // select: false
  },
  year: {
    type: String,
  },
  rollNumber: String,
  branch: {
    type: String,
  },
  skills:
  {
    type: String
  }
  ,
  googleId: {
    type: String
  },

  // confirmPassword: {
  //   type: String,
  //   required: [true, 'Confirm your password'],
  //   validate: {
  //     //this only works on CREATE and SAVE methods
  //     validator: function(val) {
  //       return this.password === val;
  //     },
  //     message: 'Confirm password is not the same as Password'
  //   }
  // },
  // passwordChangedAt: Date,
  // //
  // passwordResetToken: String,
  // //
  // passwordResetExpires: Date,
  providerGoogle: {
    type: Boolean,
    default: false
  },
  // active: {
  //   type: Boolean,
  //   default: true,
  //   select: false
  // }
  doubts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Doubt'
    }
  ],
  replies: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Reply'
    }
  ]
});

userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field
  this.confirmPassword = undefined;
});

// userSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// userSchema.pre(/^find/, function(next) {
//   //to provide only active users
//   this.find({ active: { $ne: false } }).select('-__v');
//   next();
// });

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
//   if (this.passwordChangedAt) {
//     const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;

//     return changedTimeStamp > JWTTimeStamp;
//   }
//   //if password was never changed
//   return false;
// };

// userSchema.methods.createPasswordResetToken = function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min

//   return resetToken;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
