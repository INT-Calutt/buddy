const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: {
		popup: path.resolve('src/popup/popup.tsx'),
		options: path.resolve('src/options/options.tsx'),
		background: path.resolve('src/background/background.ts'),
		contentScript: path.resolve('src/contentScript/contentScript.tsx'),
	},
	module: {
		rules: [
			{
				use: 'ts-loader',
				test: /\.tsx?$/,
				exclude: /node_modules/,
			},
			{
				use: ['style-loader', 'css-loader', 'sass-loader'],
				test: /\.s[ac]ss$/i,
			},
			{
				use: ['svg-react-loader'],
				test: /\.svg$/i,
			},

			{
				type: 'asset/resource',
				test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf)$/,
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve('src/static'),
					to: path.resolve('dist'),
				},
			],
		}),
		...getHtmlPlugins(['popup', 'options', 'contentScript']),
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve('dist'),
	},
	optimization: {
		splitChunks: {
			chunks(chunk) {
				return chunk.name !== 'contentScript';
			},
		},
	},
};

function getHtmlPlugins(chunks) {
	return chunks.map(
		(chunk) =>
			new HtmlPlugin({
				title: 'Buddy',
				filename: `${chunk}.html`,
				chunks: [chunk],
			})
	);
}
