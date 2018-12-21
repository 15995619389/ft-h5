const Merge = require('webpack-merge');
const BaseConfig = require('./webpack.base.js');
const webpack = require('webpack');

module.exports = Merge(BaseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                "NODE_ENV": JSON.stringify("development")
            }
        }),
    ],
    devtool:"inline-source-map"
});