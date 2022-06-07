import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import config from '../../config/config.js';

const user = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    validator: [validator.isEmail],
  },
  password: {
    type: String,
    required: [true, 'enter password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'confirm password'],
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: 'Password mismatch',
    },
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  privateKey: {
    type: String,
    default: null,
  },
});

user.pre('save', async function (next) {
  // only runs when the password is modified
  if (!this.isModified('password')) return next();

  // HAshes the password
  this.password = await bcrypt.hash(this.password, Number(config.SALT));

  // Deletes the CP
  this.passwordConfirm = undefined;

  next();
});

user.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};
user.methods.compareOTP = function (OTP) {
  if (OTP === this.otp) {
    return true;
  }

  return false;
};

const User = mongoose.model('User', user);

export default User;
