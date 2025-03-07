const resolve = require('path').resolve;
    module.exports = {
      extends: resolve(__dirname, '../../webpack.config.base.js'),
      entry: resolve(__dirname, './src/main.ts')
    };
