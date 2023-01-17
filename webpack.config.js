const path = require('path');
const fs = require('fs');
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
    //publicPath: 'https://localhost:3003/'
  },
  plugins: [
    new webpack.BannerPlugin({ banner: banner }),
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8'))
  ],
  /*
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, ''),
    publicPath: '/dist',
    stats: { colors: true },
    port: 3003,
    https: {
      ca: fs.readFileSync(path.resolve(__dirname,'./config/ssl/ca.crt')),
      cert: fs.readFileSync(path.resolve(__dirname,'./config/ssl/localhost.pem')),
      key: fs.readFileSync(path.resolve(__dirname,'./config/ssl/localhost-key.pem'))
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    allowedHosts: [
      '.digitalriver.com'
    ]
  },
  plugins: [
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
    new webpack.HotModuleReplacementPlugin()
  ],
  */
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
    sourceMapFilename: '[file].map[query]',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
    globalObject: 'this',
    publicPath: 'https://localhost:3002/'
  },
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, ''),
    publicPath: '/dist',
    disableHostCheck: true,
    stats: { colors: true },
    port: 3002,
    https: {
      ca: fs.readFileSync(path.resolve(__dirname,'./config/ssl/ca.crt')),
      cert: fs.readFileSync(path.resolve(__dirname,'./config/ssl/localhost.pem')),
      key: fs.readFileSync(path.resolve(__dirname,'./config/ssl/localhost-key.pem'))
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    allowedHosts: [
      '.digitalriver.com'
    ]
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
  devtool: "source-map",
  optimization: {
    namedModules: true,
    concatenateModules: false,
  }
};

module.exports = clientConfig; //,serverConfig];
