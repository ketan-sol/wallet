import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_KEY: process.env.JWT_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  MAIL_ADDRESS: process.env.MAIL_ADDRESS,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  SALT: process.env.SALT,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  INFURA_ID: process.env.INFURA_ID,
};

export default config;
