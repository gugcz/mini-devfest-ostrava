const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, '../src'),
        hot: true,
    },
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
})