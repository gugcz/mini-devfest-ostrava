const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    plugins: [
        new CleanWebpackPlugin(['../dist']),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: ["style-loader", "css-loader",
                {
                    loader: "sass-loader",
                    options: {
                        includePaths: ['./node_modules'],
                    }
                }]
        }]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    }
};