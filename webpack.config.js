const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/client/index.tsx', // Ensure correct entry point
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // Ensure '.ts' and '.tsx' are included
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'], // Handle CSS if needed
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000',
      },
    ], 
    historyApiFallback: true,
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};