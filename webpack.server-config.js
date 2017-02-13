var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/server/Server.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src/server", "node_modules"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  externals: { natives: 'commonjs natives' },
  // devtool: 'sourcemap'
  node: {
    __dirname: true,
    __filename: true
  }
}