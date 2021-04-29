const path = require("path");

module.exports = {
  mode: "development",
  entry: ["./demo/index.js", "./demo/index.html"],
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: "file-loader",
        options: { name: "[name].[ext]" },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "Physics.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
