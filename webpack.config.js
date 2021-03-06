const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const pkgJson = require('./package.json');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let config = {
  mode: 'production',
  entry: [
    'core-js/modules/es.reflect.construct',
    'core-js/es/array',
    './src/index.js'
  ],
  optimization: {
    minimizer: [ new UglifyJsPlugin({
      sourceMap: true,
      // uglifyOptions: {
      //   compress: { warnings: false }
      // }
    })],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'html-custom-element.umd.js',
    library: pkgJson.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      { 
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test:/\.scss$/,
        use:['to-string-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new CleanWebpackPlugin(['dist/*']),
    new CopyWebpackPlugin([{ from: 'typings/*', to: '', flatten: true}])
  ]
}

if (process.env.NODE_ENV === 'development') {
  config = Object.assign(config, {
    mode: 'development',
    entry: {
      app: './demo'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'demo/index.html',
        inject: true
      }),
      new CopyWebpackPlugin([{from: 'demo/chrome.png', to: 'chrome.png'}])
    ]
  });
}

module.exports = config;
