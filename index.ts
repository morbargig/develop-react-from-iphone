import express from 'express';
import webpack, { Configuration } from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

// Setup
const app = express();
const port = process.env['REACT_APP_PORT'] || process.env['PORT'] || 80;
import config from './front/webpack.config';
const compiler = webpack(<Configuration>config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  serverSideRender: false,
  watchOptions: {
    // Due to iOS devices memory constraints
    // disabling file watching is recommended 
    ignored: /.*/
  }
});
app.use(middleware);
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Launch app
app.listen(port, () => {
  console.log(
    'Launching app... http://localhost:' + port + '\n'
  );
});

// Register app and middleware. Required for better
// performance when running from play.js
// @ts-ignore
try { (pjs as any).register(app, middleware); } catch (error) { }
