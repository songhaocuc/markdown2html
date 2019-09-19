const path = require('path');

const config = {
    entry: './dist/app.js',
    output: {
        filename: 'markdown2html.js',
        path: path.resolve(__dirname, 'build')
    },
    target: 'node'
};

module.exports = config;