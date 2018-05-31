const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    'my-custom-element-library.js': './src/index.js',
    'my-custom-element-library.css': './src/index.scss',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]'
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
        test: /\.[s]?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            'sass-loader'
          ]
        })
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('my-custom-element-library.css'),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]
}

if (process.env.NODE_ENV === 'development') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]);
}
