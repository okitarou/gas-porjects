const GasPlugin = require('gas-webpack-plugin');
module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new GasPlugin({
      autoGlobalExportsFiles: ['**/*.ts']
    })
  ]
};
