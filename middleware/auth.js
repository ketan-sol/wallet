import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../components/user/userModel.js';
import { handleResponse, handleError } from '../config/handler.js';

const sendResponseWithJWt = async (user, statusCode, res) => {
  try {
    const token = jwt.sign(
      { id: user._id, account: user.account },
      config.JWT_KEY,
      {
        expiresIn: config.JWT_EXPIRES_IN,
      }
    );

    user.password = undefined;

    return handleResponse({
      res,
      data: token,
    });
  } catch (err) {
    return handleError({
      res,
      err_msg: err,
    });
  }
};

const getJWT = async (req, res) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      [, token] = req.headers.authorization.split(' ');
    }
    if (!token)
      return handleError({
        res,
        err_msg: 'Token unavailable',
      });

    // 2>validate token
    const decoded = jwt.verify(token, config.JWT_KEY);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return handleError({
        res,
        statusCode: 401,
        err_msg: 'User does not exist using this token',
      });
    // grant permission
    return currentUser;
  } catch (err) {
    return handleError({
      res,
      err_msg: 'error while extracting user from jwt token ',
    });
  }
};

const verifyJWT = async (req, res, next) => {
  const currentUser = await getJWT(req, res);
  // permission granted
  req.user = currentUser;
  next();
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return handleError({
      res,
      statusCode: 400,
      err_msg: 'Please enter email or password',
    });

  // 2. user exist and valid password
  const user = await User.findOne({ email }).select('+password');
  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    return handleError({
      res,
      statusCode: 401,
      err_msg: 'Invalid password or email',
    });
  }

  if (!user.isVerified) {
    return handleError({
      res,
      statusCode: 401,
      err_msg: 'User not verified',
    });
  }
  // send response to legitimate user

  sendResponseWithJWt(user, 200, res);

  next();
};

const isUserVerified = async (req, res, next) => {
  const user = await getJWT(req, res);

  if (!user.isVerified)
    return handleError({
      res,
      statusCode: 401,
      err_msg: 'User not verified',
    });

  if (user.privateKey !== null)
    return handleError({
      res,
      statusCode: 409,
      err_msg: 'Wallet already exist',
    });

  // Move to wallet creation
  req.user = user;
  next();
};

export { login, verifyJWT, sendResponseWithJWt, getJWT, isUserVerified };
