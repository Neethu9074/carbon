/*eslint-env node */
'use strict';

var webpack = require('webpack');
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),

	// this is necessary for the React and Invariant modules
	'process.env.NODE_ENV': process.env.BUILD_DEV === 'true' ? '"development"' : '"production"'
});

module.exports = {
	entry: './demo/js/index.es6',
  output: {
    path: './target/bundle/',
    publicPath: '../target/bundle/',
    filename: 'index.js'
  },
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.less$/i,
			loader: 'style-loader!css-loader!less-loader'
		}, {
			test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot|\.obj$/i,
			loader: 'file-loader'
		}, {
			test: /\.glsl$/i,
			loader: 'raw-loader'
		}, {
	    test: /\.es6$/i,
	    loader: 'babel-loader'
    }]
	},
	plugins: [
		definePlugin
	],
	resolve: {
		extensions: ["", ".js", '.es6'],
		alias: {
			'three.js': path.join(__dirname,
        '/node_modules/three.js/build/three.js')
		}
	}
};
