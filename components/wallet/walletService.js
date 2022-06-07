import { generateMnemonic, mnemonicToSeed } from 'bip39';
import pkg from 'ethereumjs-wallet';
import bcrypt from 'bcryptjs';
import User from '../user/userModel.js';
import config from '../../config/config.js';

const { hdkey } = pkg;

const genMnemonicService = async (strength, user) => {
  try {
    const mnemonic = generateMnemonic(strength);
    const masterSeed = await mnemonicToSeed(mnemonic);
    const masterNode = hdkey.fromMasterSeed(masterSeed);
    const child = masterNode.derivePath(`m/44'/60'/0'/0/0`).getWallet();
    const address = `0x${child.getAddress().toString('hex')}`;
    const privateKey = `${child.getPrivateKey().toString('hex')}`;

    const hashedPk = await bcrypt.hash(privateKey, Number(config.SALT));

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          privateKey: hashedPk,
        },
      },
      { new: true }
    );

    return { address, privateKey };
  } catch (err) {
    throw err;
  }
};

export default genMnemonicService;
