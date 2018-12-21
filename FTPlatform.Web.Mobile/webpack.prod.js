const Merge = require('webpack-merge');
const BaseConfig = require('./webpack.base.js');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = Merge(BaseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new BundleAnalyzerPlugin({
            analyzerPort:7024
        })
    ],
    devtool:"cheap-module-source-map"
});
