const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: {
    server: [
      './index.ts'
    ]
  },
  // target: 'node',
  // resolve: {
  //   // extensions: ['.ts', '.js'],
  // },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: (m) => { return /\.ts$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) && /client/.test(m) },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              "@babel/preset-typescript",
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: (m) => { return /\.(png|jp(e*)g|svg)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) && /client/.test(m) },
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[hash]-[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname),
    publicPath: '/'
  },
  node: {
    __dirname: false
  }
  // externals: {
  //   express: 'express',
  // },
};
