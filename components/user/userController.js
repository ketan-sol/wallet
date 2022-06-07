import { sendResponseWithJWt } from '../../middleware/auth.js';
import { handleError } from '../../config/handler.js';
import createUser from './userService.js';

const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const result = await createUser(name, email, password, passwordConfirm);

    sendResponseWithJWt(result, 201, res);
  } catch (err) {
    return handleError({
      res,
      statusCode: 401,
      err_msg: 'error in sign up',
    });
  }
};

export default signup;
