const path = require('path');
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'
process.env['PORT']

module.exports = {
  mode: 'development',
  entry: {
    app: [
      './front/src/app.tsx'
    ]
  },
  resolve: {
    modules: ['.', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: (m) => { return /\.(ts|js|tsx|jsx)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
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
        test: (m) => { return /\.css$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: (m) => { return /\.(png|jp(e*)g|svg)$/.test(m) },
        exclude: (m) => { return /node_modules/.test(m) },
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
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [

  ],
  devtool: isDev ? 'source-map' : false,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  }
};
