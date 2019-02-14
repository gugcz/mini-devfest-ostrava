const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    plugins: [
        new CleanWebpackPlugin(['../dist']),
        new CopyWebpackPlugin([{from: './src/images', to: './images'}]),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: ["style-loader", 
            {
                loader: "css-loader",
                options: {
                    url: false
                }
            }, "resolve-url-loader", {
                loader: "sass-loader",
                options: {
                    includePaths: ['./node_modules'],
                    sourceMap: true,
                    sourceMapContents: false
                }
            }]
        }]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    }
};
