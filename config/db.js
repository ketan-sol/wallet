import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';

const mongoInit = () => {
  try {
    mongoose.connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Database Connected .');
  } catch (e) {
    logger.error(e.message);
  }
};

export default mongoInit;
