const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point for your app
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'build'), // Output folder
    library: {
      type: "module", // Use ESModules
    },
    module: true, // Required for module output
  },
  experiments: {
    outputModule: true, // Enable module output
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // This rule processes .css files
        use: ['style-loader', 'css-loader'], // Use these loaders for CSS
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'], // This rule handles SVGs as React components
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: './build',
  },
};
