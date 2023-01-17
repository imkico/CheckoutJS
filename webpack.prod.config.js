const path = require('path');
const fs = require('fs');
const nodeExtensions = require('webpack-node-externals');
const webpack = require('webpack');
const PACKAGE = require('./package.json');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const banner = `Name: ${PACKAGE.name} | Version: ${PACKAGE.version} | Build-Time: ${(new Date()).toUTCString()}`;

const serverConfig = {
  target: 'node',
  entry: './src/checkout.js',
  output: {
    library: {
      root: 'CheckoutJS',
      amd: 'checkout-js',
      commonjs: 'checkout-js'
    },
    filename: 'CheckoutJS.node.js',
    sourceMapFilename: 'CheckoutJS.node.map',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    //umdNamedDefine: true,
    //libraryExport: 'default',
    //globalObject: 'this',
  },
  plugins: [
    new webpack.BannerPlugin({ banner: banner }),
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8'))
  ],
  externals: [nodeExtensions()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/esm",
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  optimization: {
    concatenateModules: false
  },
  devtool: "source-map"
};

const clientConfig = {
  //entry: ['core-js','./src/index.js'],
  entry: {
    polyfills: './src/browsers/polyfills.js',
    CheckoutJS: './src/index.js',
  },
  output: {
    library: {
      root: 'CheckoutJS',
      amd: 'checkout-js',
      commonjs: 'checkout-js'
    },
    //filename: 'CheckoutJS.js',
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
    globalObject: 'this'
  },
  plugins: [
    new webpack.BannerPlugin({ banner: banner }),
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
    new FileManagerPlugin({
      onStart: [{
        copy: [
          {
            source: path.join(__dirname, 'src/browsers/paymentCallBack.html'),
            destination: path.join(__dirname, 'dist')
          }
        ]
      }],
      onEnd: [{
        copy: [
          {
            source: path.join(__dirname, 'dist/CheckoutJS.js'),
            destination: path.join(__dirname, `dist/CheckoutJS-${PACKAGE.version}.js`)
          }
        ]
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  externals: {
    "crypto":"crypto",
  },
  devtool: "source-map",
  optimization: {
    concatenateModules: false
  },
  performance: {
    hints: false
  },
};

module.exports = [clientConfig,serverConfig];
