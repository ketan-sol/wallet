import { handleError, handleResponse } from '../config/handler.js';
import User from '../components/user/userModel.js';
import { getJWT } from '../middleware/auth.js';

const verifyEmail = async (req, res) => {
  try {
    const user = await getJWT(req, res);
    const valid = user.compareOTP(req.body.otp);
    if (!valid) {
      return handleError({
        res,
        statusCode: 401,
        err_msg: 'Invalid OTP',
      });
    }
    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { isVerified: true } }
    );
    return handleResponse({ res, msg: 'OTP verified' });
  } catch (err) {
    return handleError({
      res,
      data: err,
      err_msg: 'Error during verifying the OTP',
    });
  }
};

export default verifyEmail;
