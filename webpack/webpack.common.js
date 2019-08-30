const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                exclude: [path.resolve(__dirname, '../node_modules')],
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                exclude: /node_modules/,
                test: /\.graphql$/,
                use: [{ loader: 'graphql-import-loader' }]
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@logger':     path.resolve(__dirname, '../src/core/common/logger'),
            '@ports':      path.resolve(__dirname, '../src/ports'),
            '@adapters':   path.resolve(__dirname, '../src/adapters'),
            '@services':   path.resolve(__dirname, '../src/core/services/'),
            '@interfaces': path.resolve(__dirname, '../src/core/interfaces/'),
            '@apiErrors':  path.resolve(__dirname, '../src/core/models/ApiError'),
            '@entities':   path.resolve(__dirname, '../src/core/entities/'),
            '@database':   path.resolve(__dirname, '../src/modules/database/'),
            '@resolvers':  path.resolve(__dirname, '../src/modules/graphql/resolvers')
        }
    },
    target: 'node'
};