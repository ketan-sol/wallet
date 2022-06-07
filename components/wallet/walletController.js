import { handleResponse, handleError } from '../../config/handler.js';
import genMnemonicService from './walletService.js';

const genMnemonic = async (req, res) => {
  try {
    const { strength } = req.body;
    const { user } = req;
    const data = await genMnemonicService(strength, user);

    return handleResponse({ res, data });
  } catch (error) {
    return handleError({ res, error });
  }
};

export default genMnemonic;
