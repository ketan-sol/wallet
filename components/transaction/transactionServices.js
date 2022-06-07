import Tx from '@ethereumjs/tx';
import Common, { Chain } from '@ethereumjs/common';
import Web3 from 'web3';
import config from '../../config/config.js';
import ABI from '../blockchain/ABI.json' assert { type: 'json' };
import TransactionModel from './transactionModel.js';

const web3Object = new Web3(
  new Web3.providers.HttpProvider(
    `https://ropsten.infura.io/v3/${config.INFURA_ID}`
  )
);
const { Transaction } = Tx;
const commonObject = new Common.default({ chain: Chain.Ropsten });

const transferTokens = async (privateKey, to, amount) => {
  try {
    const contract = new web3Object.eth.Contract(
      ABI.abi,
      config.CONTRACT_ADDRESS
    );

    const pk = Buffer.from(privateKey, 'hex');
    const nonce = await web3Object.eth.getTransactionCount(
      web3Object.eth.accounts.privateKeyToAccount(privateKey).address,
      'pending'
    );

    const txParams = {
      nonce: web3Object.utils.toHex(nonce),
      gasPrice: web3Object.utils.toHex(web3Object.utils.toWei('50', 'gwei')),
      to: config.CONTRACT_ADDRESS,
      gasLimit: web3Object.utils.toHex('3000000'),
      data: contract.methods
        .transfer(to, web3Object.utils.toWei(amount, 'ether'))
        .encodeABI(),
    };

    let tx = Transaction.fromTxData(txParams, { common: commonObject });
    tx = tx.sign(pk);
    const serializedTx = tx.serialize();
    console.log(serializedTx);

    const result = await web3Object.eth
      .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
      .once('transactionHash', (txHash) => {
        console.log('transactionHash');
        console.log({ txHash });
      })
      .once('receipt', (receipt) => {
        createTx(receipt, amount);
      })
      .on('error', (data) => {
        console.log('error');
        console.log(data);
      });

    return result;
  } catch (error) {
    throw error;
  }
};

const createTx = async (receipt, amount) => {
  const userTx = await TransactionModel.create({
    transactionHash: receipt.transactionHash,
    from: receipt.from,
    to: receipt.to,
    status: receipt.status,
    value: amount,
    timestamp: new Date(),
  });
};

const getTx = async (txHash) => {
  const result = await TransactionModel.findOne({ transactionHash: txHash });
  if (!result) {
    throw err;
  }

  return result;
};

export default transferTokens;
