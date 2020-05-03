const path = require('path');

module.exports = {
    entry: {
        'index.js': './src/index.ts',
        'actions/index.js': './src/actions/index.ts',
        'countries/france/index.js': './src/countries/france/index.ts'
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
};