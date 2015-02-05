var webpack = require('webpack');
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

console.log(__dirname);

module.exports = {
  entry: './src/javascript/index.js',
  output: {
    path: path.join(__dirname, 'target/bundle/'),
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.less$/i,
        loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.css$/i,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$/i,
        loader: 'file-loader'
      }, {
        test: /\.js$/i,
        loader: 'jsx-loader?harmony&insertPragma=React.DOM&stripTypes'
      }
    ]
  },
  plugins: [
    definePlugin
  ],
  resolve: {
    alias: {
      'bootswatch-lumen.css': __dirname + '/node_modules/Bootswatch/lumen/bootstrap.css',
      'prism': __dirname + '/node_modules/prismjs/prism.js',
      'prism.css': __dirname + '/node_modules/prismjs/themes/prism.css'
    }
  }
};
