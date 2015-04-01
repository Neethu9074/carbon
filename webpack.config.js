/*eslint-env node */
'use strict';

var webpack = require('webpack');
var path = require('path');

var definePlugin = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
	entry: './src/js/index.js',
	output: {
		path: path.join(__dirname, 'target/bundle/'),
		filename: 'index.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
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
			loader: 'babel-loader'
		}]
	},
	plugins: [
		definePlugin
	],
	resolve: {
		alias: {
			// 'three.js': path.join(__dirname, '/node_modules/three.js/build/three.js')
		}
	}
};
