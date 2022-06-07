import User from './userModel.js';
import generateOTP from '../../utils/index.js';
import sendOtp from '../../middleware/email.js';

const createUser = async (name, email, password, passwordConfirm) => {
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const OTP = generateOTP();
    await User.findOneAndUpdate({ _id: newUser._id }, { $set: { otp: OTP } });
    sendOtp(OTP, newUser.email);

    return newUser;
  } catch (err) {
    throw err;
  }
};

export default createUser;
