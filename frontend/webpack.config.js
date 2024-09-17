const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'),  // Output folder for the bundled files
    filename: 'bundle.js',  // Name of the bundled file
    publicPath: '/',  // Serve files from the root
  },
  module: {
    rules: [
      // JavaScript and JSX files
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Transpile JS and JSX files
        },
      },
      // CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Image files
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',  // Handles images
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // Resolve these file extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // HTML file to use as template
    }),
  ],
  devServer: {
    historyApiFallback: true,  // Required for React Router to work in dev mode
    contentBase: './dist',  // Serve content from the "dist" folder
    open: true,  // Open the browser automatically
    compress: true,  // Enable gzip compression
    hot: true,  // Enable hot module replacement
    port: 3000,  // Development server port
  },
};
