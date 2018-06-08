const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pkgJson = require('./lib/package.json');

let config = {
  context: __dirname + "/lib",
  entry: {
    [pkgJson.name]: './src/index.ts',
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, './lib/dist'),
    filename: '[name].umd.js',
    library: pkgJson.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { ignoreDiagnostics: [2551, 2554, 2339] }
      },
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
    new CleanWebpackPlugin(['lib/dist/*']),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]
}

if (process.env.NODE_ENV === 'development') {
  config = Object.assign(config, {
    context: __dirname,
    resolve: {
      alias: { 
        // 'html-custom-element': path.resolve(__dirname, 'lib')
        'html-custom-element': path.resolve(__dirname, 'lib/src/')
      },
      extensions: ['.js', '.ts']
    },
    entry: {
      app: './app/index.ts'
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
        template: 'app/index.html',
        inject: true
      })
    ]
  });
console.log('xxxxxxxxxxxxxx config', config);
}

module.exports = config;