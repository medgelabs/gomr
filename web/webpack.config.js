const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const PrettierPlugin = require("prettier-webpack-plugin")

module.exports = {
  devtool: "cheap-eval-source-map",
  entry: {
    app: [path.join(__dirname, "src", "index.js")],
    vendors: ["react", "react-dom", "react-router"]
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].[hash].bundle.js",
    sourceMapFilename: "[name].[hash].bundle.map"
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss"],
    alias: {
      "@styles": path.resolve(__dirname, "src", "scss")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ]
      },
      {
        test: /\.html$/,
        use: [
          { loader: "html-loader" }
        ]
      },
      // Assets loaders
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        use: [
          { loader: "url-loader?limit=10000" }
        ]
      },
      {
        test: /\.(gif|jpg|png)/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "url-loader?limit=10000" }
        ]
      }
    ]
  },
  plugins: [
    new PrettierPlugin({
      printWidth: 120,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      encoding: 'utf-8',
      bracketSpacing: true,
      endOfLine: 'lf',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "src", "template.html"),
      inject: "body"
    })
  ]
}
