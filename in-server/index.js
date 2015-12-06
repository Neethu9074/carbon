require('instana-nodejs-sensor')();

import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes';

const app = express();

app.set('x-powered-by', false);

app.use(cookieParser());
app.use(routes);

const server = app.listen(3131, '127.0.0.1', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('ui-client in-server listening at http://%s:%s', host, port);
});
