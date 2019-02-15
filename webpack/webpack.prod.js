const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        })
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader',
                MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }, 'resolve-url-loader', {
                    loader: 'sass-loader',
                    options: {
                        includePaths: ['./node_modules'],
                        sourceMap: true,
                        sourceMapContents: false
                    }
                }]
        }]
    }
});