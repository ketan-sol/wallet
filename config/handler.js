import logger from './logger.js';

const handleResponse = ({
  res,
  statusCode = 200,
  msg = 'Success',
  data = {},
  result = 1,
}) => {
  logger.info(msg, JSON.stringify(data));
  res.status(statusCode).send({ result, msg, data });
};
const handleError = ({
  res,
  statusCode = 500,
  err_msg = 'Server Error',
  data = {},
  result = 0,
}) => {
  res.status(statusCode).send({
    result,
    err_msg,
    data,
  });
};

export { handleError, handleResponse };
