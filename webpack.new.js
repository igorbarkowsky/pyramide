const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
// const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');


const srcDir = './src';// Site dir on server (relative to this config)
const dstDir = './new';// Site dir on server (relative to this config)

module.exports = {
	mode: "production",
	entry: {
		index: `${srcDir}/index.js`
	},
	output:
	{
		path: path.resolve(__dirname, dstDir),
		filename: '[name].js',
		publicPath: './',
	},
	optimization: {
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new TerserPlugin({
				extractComments: /^foo$/,
			}),
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			// dry:true,
			cleanOnceBeforeBuildPatterns: [
				'index.html', 
				'index.js*', 
				'index.css*', 
				'favicon.png', 
				'assets/*', 
				'locales/*', 
			],
		}),
		new CopyWebpackPlugin([
			// {from: '**/*.+(png|jpg|gif|svg)', to: './assets/img', context: srcDir},
			{from: './locales', to: './locales', context: srcDir},
		]),
		// new SpriteLoaderPlugin(),
		// new SVGSpritemapPlugin({
		// 	src: `${srcDir}/**/*.svg`,
		// 	svgo: {
		// 		removeMetadata: true,
		// 	},
		// }),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'Pyramide Solitaire',
			favicon: `${srcDir}/assets/img/favicon.png`,
		}),
	],
	module:
	{
		rules:
		[
			// {
			// 	test: /\.svg$/,
			// 	loader: 'svg-sprite-loader',
			// 	options: {
			// 		extract: true,
			// 	}
			// },
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				// include: path.resolve(__dirname, `${srcDir}/assets/img`),
				use: [
					{
						loader: 'url-loader',
						options: {
							context: srcDir, name:'[path][name].[ext]',
							limit: 128,
						}
					},
				],
			},
			{
				test: /\.(css)$/,
				// include: path.resolve(__dirname, srcDir),
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.(sass|scss)$/,
				include: path.resolve(__dirname, `${srcDir}/assets/css`),
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						// options: {context: srcDir, name:'[path][name].[ext]'},
					},
					{
						loader: 'css-loader',
						options:{
							// context: srcDir,
							sourceMap: false,
							// minimize: true,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: false,
						}
					},
				],
			},
		]
	},
};