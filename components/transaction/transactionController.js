import transferTokens from './transactionServices.js';
import { handleError, handleResponse } from '../../config/handler.js';

const transfer = async (req, res) => {
  try {
    const { privateKey, to, amount } = req.body;

    const result = transferTokens(privateKey, to, amount);
    handleResponse({ res, data: result });
  } catch (error) {
    handleError({ res, err_msg: 'Transfer failed' });
  }
};

const getTransaction = async (req, res) => {
  try {
    const txHash = req.params.txhash;

    const result = getTx(txHash);
    handleResponse({ res, statusCode: 200, data: result });
  } catch (error) {
    handleError({ res, statusbar: 401, err_msg: 'Tx not found' });
  }
};

export { transfer, getTransaction };
