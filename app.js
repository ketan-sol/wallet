import express from 'express';
import cors from 'cors';
import './config/config.js';
import mongoInit from './config/db.js';
import indexRouter from './components/index.js';
import { handleError } from './config/handler.js';
import './components/transaction/transactionServices.js';

const app = express();
mongoInit();

app.use(cors());
app.use(express.json());
// app.use(
// 	express.json({
// 		verify: (req, res, buf) => {
// 			req.rawBody = buf;
// 		},
// 	})
// );
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', indexRouter);

app.all('*', (req, res, next) => {
  next(
    handleError({
      res,
      statusCode: 404,
      err: `Can't find ${req.originalUrl} on this server!`,
    })
  );
});

export default app;
